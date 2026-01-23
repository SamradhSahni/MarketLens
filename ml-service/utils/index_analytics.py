import pandas as pd
import numpy as np

def index_overview(df: pd.DataFrame):
    # ---------------- FIND INDEX COLUMNS ----------------
    close_col = [c for c in df.columns if c.startswith("Close_")][0]
    open_col  = [c for c in df.columns if c.startswith("Open_")][0]
    high_col  = [c for c in df.columns if c.startswith("High_")][0]
    low_col   = [c for c in df.columns if c.startswith("Low_")][0]

    df["Date"] = pd.to_datetime(df["Date"])
    df = df.sort_values("Date")

    # ---------------- HISTORY ----------------
    history = [
        {
            "date": d.strftime("%Y-%m-%d"),
            "price": round(float(p), 2),
        }
        for d, p in zip(df["Date"], df[close_col])
    ]

    # ---------------- STATS ----------------
    last = df.iloc[-1]
    prev = df.iloc[-2]

    stats = {
        "last_close": round(float(last[close_col]), 2),
        "prev_close": round(float(prev[close_col]), 2),
        "change": round(float(last[close_col] - prev[close_col]), 2),
        "change_pct": round(
            ((last[close_col] - prev[close_col]) / prev[close_col]) * 100, 2
        ),
        "today_open": round(float(last[open_col]), 2),
        "today_high": round(float(last[high_col]), 2),
        "today_low": round(float(last[low_col]), 2),
        "week52_high": round(float(df[high_col].tail(252).max()), 2),
        "week52_low": round(float(df[low_col].tail(252).min()), 2),
    }

    # ---------------- RETURNS ----------------
    def ret(days):
        if len(df) < days:
            return None
        return round(
            ((df[close_col].iloc[-1] / df[close_col].iloc[-days]) - 1) * 100, 2
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
        "history": history,
        "stats": stats,
        "returns": returns,
    }
