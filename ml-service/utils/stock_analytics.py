import pandas as pd

def stock_analysis(df: pd.DataFrame, symbol: str):
    df = df[["Date", symbol]].dropna().copy()
    df["Date"] = pd.to_datetime(df["Date"])
    df = df.sort_values("Date")

    # ---------------- HISTORY ----------------
    history = [
        {
            "date": d.strftime("%Y-%m-%d"),
            "price": round(float(p), 2),
        }
        for d, p in zip(df["Date"], df[symbol])
    ]

    # ---------------- RETURNS ----------------
    def ret(days):
        if len(df) < days:
            return None
        return round(
            ((df[symbol].iloc[-1] / df[symbol].iloc[-days]) - 1) * 100, 2
        )

    returns = {
        "1D": ret(2),
        "1W": ret(6),
        "1M": ret(21),
        "6M": ret(126),
        "1Y": ret(252),
        "5Y": ret(1260),
    }

    return {
        "symbol": symbol,
        "history": history,
        "returns": returns,
    }
