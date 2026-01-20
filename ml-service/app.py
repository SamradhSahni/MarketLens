import os
import logging
from pathlib import Path
from typing import List

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from utils.lstm_predictor import predict_prices, generate_future_dates
from utils.portfolio_optimizer import portfolio_optimization
from utils.correlation_network import build_correlation_network
from utils.correlation_plot import generate_correlation_plot
from utils.index_analytics import index_overview
from utils.stock_analytics import stock_analysis
from utils.sector_analytics import sector_overview


# -------------------------------------------------
# 🔥 DATA PATHS (SEPARATED CORRECTLY)
# -------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[1]

STOCK_DATA_PATH = str(
    BASE_DIR / "server" / "datasets" / "nifty50_stocks_cleaned.csv"
)

INDEX_DATA_PATH = str(
    BASE_DIR / "server" / "datasets" / "nifty_index_data.csv"
)

SECTOR_MAP_PATH = str(
    BASE_DIR / "server" / "datasets" / "nifty50_tickers_and_sectors.csv"
)

PLOT_PATH = "correlation_network.png"

# -------------------------------------------------
# LOGGING
# -------------------------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# -------------------------------------------------
# FASTAPI APP
# -------------------------------------------------

app = FastAPI(title="Nifty ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# MODELS
# -------------------------------------------------

class PredictionRequest(BaseModel):
    symbol: str
    days: int


class PortfolioRequest(BaseModel):
    symbols: List[str]
    target_return: float


class CorrelationRequest(BaseModel):
    symbols: List[str]
    threshold: float = 0.6


# -------------------------------------------------
# HEALTH
# -------------------------------------------------

@app.get("/health")
def health():
    return {"status": "healthy"}


# -------------------------------------------------
# PREDICTION
# -------------------------------------------------

@app.post("/predict")
def predict(req: PredictionRequest):
    try:
        df = pd.read_csv(STOCK_DATA_PATH)

        if req.symbol not in df.columns:
            raise HTTPException(status_code=404, detail="Stock not found")

        stock_series = df[req.symbol].dropna()
        if stock_series.empty:
            raise HTTPException(status_code=404, detail="No data for stock")

        last_date = pd.to_datetime(df["Date"].iloc[-1])

        preds = predict_prices(req.symbol, stock_series, req.days)
        future_dates = generate_future_dates(last_date, req.days)

        return {
            "symbol": req.symbol,
            "forecast_days": req.days,
            "predictions": [
                {
                    "date": d.strftime("%Y-%m-%d"),
                    "price": float(round(float(p), 2)),
                }
                for d, p in zip(future_dates, preds)
            ],
        }

    except Exception as e:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------------------------
# PORTFOLIO OPTIMIZATION
# -------------------------------------------------

@app.post("/portfolio/optimize")
def optimize_portfolio(req: PortfolioRequest):
    try:
        df = pd.read_csv(STOCK_DATA_PATH)

        prices = df[req.symbols].dropna()
        if prices.empty:
            raise HTTPException(status_code=400, detail="No price data")

        result = portfolio_optimization(prices, req.target_return)

        return {
            "weights_percent": {
                s: round(w * 100, 2)
                for s, w in zip(req.symbols, result["weights"])
            },
            "metrics_percent": {
                k: round(v * 100, 4)
                for k, v in result["metrics"].items()
            },
        }

    except Exception as e:
        logger.exception("Portfolio optimization failed")
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------------------------
# CORRELATION NETWORK (METRICS + PYTHON GRAPH)
# -------------------------------------------------

@app.post("/correlation/network")
def correlation_network(req: CorrelationRequest):
    try:
        df = pd.read_csv(STOCK_DATA_PATH)
        sectors_df = pd.read_csv(SECTOR_MAP_PATH)

        prices = df[req.symbols].dropna()

        result = build_correlation_network(
            prices=prices,
            sectors_df=sectors_df,
            threshold=req.threshold,
        )

        generate_correlation_plot(result["graph"], PLOT_PATH)

        return {
            "centrality": {
                metric: {k: float(v) for k, v in vals.items()}
                for metric, vals in result["centrality"].items()
            }
        }

    except Exception as e:
        logger.exception("Correlation network failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/correlation/plot")
def correlation_plot():
    if not os.path.exists(PLOT_PATH):
        raise HTTPException(status_code=404, detail="Plot not generated")
    return FileResponse(PLOT_PATH, media_type="image/png")


# -------------------------------------------------
# INDEX OVERVIEW (🔥 FIXED DATASET)
# -------------------------------------------------

@app.get("/index/overview")
def get_index_overview():
    try:
        df = pd.read_csv(INDEX_DATA_PATH)
        return index_overview(df)
    except Exception as e:
        logger.exception("Index overview failed")
        raise HTTPException(status_code=500, detail=str(e))


# -------------------------------------------------
# STOCK ANALYSIS
# -------------------------------------------------

@app.get("/stock/{symbol}")
def get_stock_analysis(symbol: str):
    try:
        df = pd.read_csv(STOCK_DATA_PATH)
        if symbol not in df.columns:
            raise HTTPException(status_code=404, detail="Stock not found")
        return stock_analysis(df, symbol)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stocks/list")
def list_stocks():
    try:
        stocks_df = pd.read_csv(
            Path(__file__).resolve().parents[1]
            / "server"
            / "datasets"
            / "nifty50_tickers_and_sectors.csv"
        )

        stocks_df = stocks_df[["Symbol", "Company", "Sector"]]

        return [
            {
                "symbol": row["Symbol"],
                "company": row["Company"],
                "sector": row["Sector"]
            }
            for _, row in stocks_df.iterrows()
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------------------------------
# SECTOR OVERVIEW
# -------------------------------------------------

@app.get("/sector/overview")
def get_sector_overview():
    try:
        df = pd.read_csv(STOCK_DATA_PATH)
        sectors_df = pd.read_csv(SECTOR_MAP_PATH)
        return sector_overview(df, sectors_df)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
