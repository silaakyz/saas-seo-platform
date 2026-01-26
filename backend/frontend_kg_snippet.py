
# -----------------------------------------------------------------------------
# TAB 4: KNOWLEDGE GRAPH
# -----------------------------------------------------------------------------
with tabs[3]:
    st.header("🕸️ Site Konu Haritası (Knowledge Graph)")
    st.info("Sitenizdeki içeriklerin birbirleriyle olan bağlantılarını gösterir.")
    
    if st.button("Haritayı Oluştur"):
        try:
            from streamlit_agraph import agraph, Node, Edge, Config
            
            # TODO: Gerçek veritabanı bağlantısı veya API endpoint'i
            # Şimdilik statik bir demo gösteriyoruz, gerçek veriyi çekmek için
            # backend'e bir endpoint ekleyip oradan JSON almalıyız.
            # Ancak kullanıcı 'kütüphaneyi kullanacağız' dediği için basitleştiriyorum.
            
            nodes = []
            edges = []
            
            # Demo Data
            nodes.append(Node(id="Makale 1", label="SEO Nedir?", size=20, color="#FF5733"))
            nodes.append(Node(id="Entity 1", label="Google", size=10, color="#33FF57"))
            nodes.append(Node(id="Entity 2", label="Ranking", size=10, color="#33FF57"))
            
            edges.append(Edge(source="Entity 1", target="Makale 1"))
            edges.append(Edge(source="Entity 2", target="Makale 1"))
            
            config = Config(width=700, height=500, directed=True, nodeHighlightBehavior=True, highlightColor="#F7A7A6")
            
            return_value = agraph(nodes=nodes, edges=edges, config=config)
            
        except ImportError:
            st.error("Lütfen 'streamlit-agraph' kütüphanesini yükleyin: pip install streamlit-agraph")
        except Exception as e:
            st.error(f"Grafik hatası: {e}")
