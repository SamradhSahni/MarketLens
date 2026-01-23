import numpy as np
import pandas as pd
import pickle
import os
from tensorflow.keras.models import load_model
from datetime import timedelta

MODEL_DIR = "models/lstm"
WINDOW_SIZE = 60


def load_assets(symbol: str):
    model_path = os.path.join(MODEL_DIR, f"lstm_{symbol}.h5")
    scaler_path = os.path.join(MODEL_DIR, f"{symbol}_scaler.pkl")

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"LSTM model not found for {symbol}")
    if not os.path.exists(scaler_path):
        raise FileNotFoundError(f"Scaler not found for {symbol}")

    model = load_model(model_path, compile=False)
    with open(scaler_path, "rb") as f:
        scaler = pickle.load(f)

    return model, scaler


def generate_future_dates(last_date, days):
    dates = []
    current = last_date

    while len(dates) < days:
        current += timedelta(days=1)
        if current.weekday() < 5:  # Mon–Fri only
            dates.append(current)

    return dates


def predict_prices(symbol: str, series: pd.Series, forecast_days: int):
    model, scaler = load_assets(symbol)

    values = series.values.reshape(-1, 1)
    scaled = scaler.transform(values)

    window = scaled[-WINDOW_SIZE:]
    future_scaled = []

    for _ in range(forecast_days):
        pred = model.predict(np.expand_dims(window, axis=0), verbose=0)
        future_scaled.append(pred[0][0])
        window = np.vstack([window[1:], pred])

    future_scaled = np.array(future_scaled).reshape(-1, 1)
    predictions = scaler.inverse_transform(future_scaled).flatten()

    return predictions
