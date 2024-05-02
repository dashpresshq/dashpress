import Link from "next/link";
import React from "react";

function Custom404() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div style={{ position: "relative", width: "100%", marginTop: "2rem" }}>
          <img
            src="https://merakiui.com/images/components/illustration.svg"
            alt=""
            style={{
              width: "100%",
              maxWidth: "400px",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>

        <p
          style={{
            fontSize: "4.25rem",
            fontWeight: "bold",
            color: "#333",
            marginTop: "3rem",
            fontFamily: "'Marker Felt', Fantasy",
            marginBottom: "1rem",
          }}
        >
          PAGE NOT FOUND
        </p>
        <p
          style={{
            fontSize: "1.7rem",
            color: "#333",
            fontWeight: "bold",
            fontFamily: "'Marker Felt', Fantasy",
          }}
        >
          SORRY, THE PAGE YOU ARE LOOKING FOR COULD NOT BE FOUND
        </p>

        <Link
          href="/"
          style={{
            fontSize: "1rem",
            display: "inline-block",
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "0.25rem",
            transition: "background-color 0.3s ease",
            marginTop: "1rem",
            textDecoration: "none",
            fontFamily: "'Marker Felt', Fantasy",
          }}
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default Custom404;
