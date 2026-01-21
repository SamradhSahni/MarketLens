import matplotlib.pyplot as plt
import networkx as nx

def generate_correlation_plot(G, filename="correlation.png"):
    plt.figure(figsize=(14, 10))

    pos = nx.spring_layout(G, seed=42, k=0.35)

    weights = [abs(G[u][v]["weight"]) * 4 for u, v in G.edges()]
    colors = ["green" if G[u][v]["weight"] > 0 else "red" for u, v in G.edges()]

    nx.draw_networkx_nodes(
        G, pos,
        node_size=3000,
        node_color="skyblue",
        edgecolors="black"
    )

    nx.draw_networkx_edges(
        G, pos,
        width=weights,
        edge_color=colors,
        alpha=0.7
    )

    nx.draw_networkx_labels(
        G, pos,
        font_size=10,
        font_weight="bold"
    )

    plt.title("Stock Correlation Network", fontsize=16)
    plt.axis("off")
    plt.tight_layout()
    plt.savefig(filename)
    plt.close()
