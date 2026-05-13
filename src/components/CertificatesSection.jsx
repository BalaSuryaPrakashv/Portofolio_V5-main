import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Certificate from "./Certificate";
import { Box, Typography, Container, Grid } from "@mui/material";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CertificatesSection = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCerts() {
      try {
        const { data, error } = await supabase
          .from("certificates")
          .select("*")
          .order("issued_date", { ascending: false });

        if (error) throw error;

        setCerts(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCerts();
  }, []);

  return (
    <Box
      component="section"
      id="certificates"
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 4 },
        overflow: "visible",
      }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2rem", md: "2.8rem" },
              fontWeight: 700,
              background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Certificates
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              color: "text.secondary",
              fontSize: "1rem",
            }}
          >
            My verified credentials and achievements
          </Typography>

          <Box
            sx={{
              width: 60,
              height: 3,
              background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
              mx: "auto",
              mt: 2,
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Loading */}
        {loading && (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              color: "text.secondary",
            }}
          >
            Loading certificates...
          </Box>
        )}

        {/* Error */}
        {error && (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              color: "error.main",
            }}
          >
            Error: {error}
          </Box>
        )}

        {/* Certificates Grid */}
        {!loading && !error && (
          <Grid
            container
            spacing={3}
            sx={{
              overflow: "visible",
            }}
          >
            {certs.map((cert) => (
              <Grid item xs={12} sm={6} md={4} key={cert.id}>
                <Certificate ImgSertif={cert.image_url} />

                <Box sx={{ mt: 1.5, px: 0.5 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: "text.primary",
                    }}
                  >
                    {cert.title}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    {cert.issuer}
                    {cert.issued_date &&
                      ` · ${new Date(cert.issued_date).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          year: "numeric",
                        }
                      )}`}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!loading && !error && certs.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              color: "text.secondary",
            }}
          >
            No certificates found.
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CertificatesSection;