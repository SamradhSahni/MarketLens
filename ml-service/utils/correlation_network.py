import networkx as nx
import pandas as pd


def build_correlation_network(prices: pd.DataFrame, sectors_df: pd.DataFrame, threshold: float):
    corr_matrix = prices.corr()

    G = nx.Graph()

    # Add nodes with sector
    for stock in prices.columns:
        sector = sectors_df.loc[sectors_df["Symbol"] == stock, "Sector"]
        sector = sector.values[0] if len(sector) else "Unknown"
        G.add_node(stock, sector=sector)

    # Add edges
    for i in range(len(prices.columns)):
        for j in range(i + 1, len(prices.columns)):
            s1, s2 = prices.columns[i], prices.columns[j]
            corr = corr_matrix.loc[s1, s2]
            if abs(corr) >= threshold:
                G.add_edge(s1, s2, weight=float(corr))

    # Centrality (same as Streamlit)
    return {
        "graph": G,
        "centrality": {
            "degree": nx.degree_centrality(G),
            "betweenness": nx.betweenness_centrality(G, normalized=True),
            "eigenvector": nx.eigenvector_centrality(G, max_iter=500),
            "pagerank": nx.pagerank(G),
        }
    }
