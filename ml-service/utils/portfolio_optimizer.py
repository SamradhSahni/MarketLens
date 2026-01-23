import numpy as np
import pandas as pd


def portfolio_optimization(prices: pd.DataFrame, target_return: float):
    """
    Mean-Variance Portfolio Optimization
    target_return: annual target return (decimal, e.g. 0.12)
    """

    returns = prices.pct_change().dropna()

    # Annualized metrics
    mu = returns.mean() * 252
    cov = returns.cov() * 252

    n = len(mu)

    # Initialize equal weights
    weights = np.ones(n) / n

    # Simple constrained optimization (no short selling)
    for _ in range(5000):
        grad = cov.values @ weights
        weights -= 0.001 * grad
        weights = np.maximum(weights, 0)
        weights /= np.sum(weights)

    portfolio_return = np.dot(weights, mu.values)
    portfolio_vol = np.sqrt(np.dot(weights.T, np.dot(cov.values, weights)))

    # Risk metrics
    port_daily = (returns @ weights)

    sharpe = portfolio_return / portfolio_vol if portfolio_vol != 0 else 0

    downside = port_daily[port_daily < 0]
    sortino = (
        portfolio_return / (downside.std() * np.sqrt(252))
        if len(downside) > 0
        else 0
    )

    wealth = (1 + port_daily).cumprod()
    max_drawdown = (wealth.cummax() - wealth).max()

    VaR = np.percentile(port_daily, 5)
    CVaR = port_daily[port_daily <= VaR].mean()

    return {
        "weights": weights,
        "metrics": {
            "expected_return": portfolio_return,
            "volatility": portfolio_vol,
            "sharpe": sharpe,
            "sortino": sortino,
            "max_drawdown": max_drawdown,
            "VaR": VaR,
            "CVaR": CVaR,
        },
    }
