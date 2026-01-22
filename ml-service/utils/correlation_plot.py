import matplotlib
matplotlib.use("Agg")  # REQUIRED

import matplotlib.pyplot as plt
import networkx as nx


def generate_correlation_plot(G, output_path):
    plt.figure(figsize=(14, 10))

    pos = nx.spring_layout(G, seed=42)

    pagerank = nx.pagerank(G)
    node_sizes = [5000 * pagerank[n] for n in G.nodes()]
    node_colors = [hash(G.nodes[n]["sector"]) % 12 for n in G.nodes()]

    # Edges
    for u, v in G.edges():
        x = [pos[u][0], pos[v][0]]
        y = [pos[u][1], pos[v][1]]
        plt.plot(x, y, color="#888", linewidth=0.6, alpha=0.7)

    nx.draw_networkx_nodes(
        G, pos,
        node_size=node_sizes,
        node_color=node_colors,
        cmap=plt.cm.rainbow,
        alpha=0.9
    )

    nx.draw_networkx_labels(G, pos, font_size=9, font_weight="bold")

    plt.title("Nifty-50 Correlation Network", fontsize=16)
    plt.axis("off")
    plt.tight_layout()
    plt.savefig(output_path, dpi=200)
    plt.close()
