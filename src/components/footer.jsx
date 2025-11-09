const Footer = () => {
  return (
    <footer style={{
      textAlign: "center",
      padding: "1rem 0",
      marginTop: "3rem",
      fontSize: "0.9rem",
      color: "#ccc",
      borderTop: "1px solid #333"
    }}>
      <p>
        © {new Date().getFullYear()} CineVerse — Built by{" "}
        <a 
          href="https://www.linkedin.com/in/abolaji-akorede-1068ab327"
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: "#ff4d4d", textDecoration: "none", fontWeight: "600" }}
        >
          Abolaji Akorede
        </a>
      </p>
    </footer>
  );
};

export default Footer;
