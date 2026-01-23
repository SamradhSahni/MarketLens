import pandas as pd


def sector_overview(df: pd.DataFrame, mapping: pd.DataFrame):
    returns = df.drop(columns=["Date"]).pct_change().dropna()

    sector_map = mapping.set_index("Symbol")["Sector"].to_dict()

    sector_returns = {}

    for stock in returns.columns:
        sector = sector_map.get(stock)
        if sector:
            sector_returns.setdefault(sector, []).append(returns[stock])

    sector_perf = {
        sector: round(float(pd.concat(vals, axis=1).mean(axis=1).sum() * 100), 2)
        for sector, vals in sector_returns.items()
    }

    return sector_perf
