import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

interface LoadingScreenProps {
  isVisible: boolean;
}

export default function LoadingScreen({ isVisible }: LoadingScreenProps) {
  const [show, setShow] = useState(isVisible);
  const { colors } = useTheme();

  useEffect(() => {
    if (isVisible) {
      setShow(true);
    } else {
      // Delay hiding to allow exit animation
      const timer = setTimeout(() => setShow(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!show) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 25%, ${colors.dark} 50%, ${colors.primary} 75%, ${colors.secondary} 100%)`,
        backgroundSize: "400% 400%",
        animation: "gradientShift 6s ease infinite",
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
        backdropFilter: "blur(2px)",
        "@keyframes gradientShift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 100%)",
          pointerEvents: "none",
        },
      }}
    >
      {/* Loading Image Container */}
      <Box
        sx={{
          position: "relative",
          mb: 4,
          animation: "fadeInScale 0.6s ease-out",
          "@keyframes fadeInScale": {
            "0%": {
              opacity: 0,
              transform: "scale(0.8)",
            },
            "100%": {
              opacity: 1,
              transform: "scale(1)",
            },
          },
        }}
      >
        <Box
          component="img"
          src="/loading image .jpg"
          alt="Loading"
          sx={{
            width: { xs: "280px", sm: "350px", md: "400px" },
            height: "auto",
            borderRadius: "20px",
            boxShadow: `0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(255, 250, 205, 0.2)`,
            border: "3px solid rgba(255, 250, 205, 0.3)",
            backdropFilter: "blur(10px)",
            animation: "floatAnimation 3s ease-in-out infinite",
            "@keyframes floatAnimation": {
              "0%, 100%": {
                transform: "translateY(0px)",
              },
              "50%": {
                transform: "translateY(-15px)",
              },
            },
          }}
        />

        {/* Glow Effect */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "110%",
            height: "110%",
            borderRadius: "20px",
            background: "radial-gradient(circle, rgba(255, 250, 205, 0.15) 0%, transparent 70%)",
            filter: "blur(15px)",
            zIndex: -1,
            animation: "glowPulse 2s ease-in-out infinite",
            "@keyframes glowPulse": {
              "0%, 100%": {
                opacity: 0.5,
              },
              "50%": {
                opacity: 1,
              },
            },
          }}
        />
      </Box>

      {/* Loading Spinner */}
      <Box
        sx={{
          position: "relative",
          width: 80,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "spinnerEntry 0.6s ease-out 0.2s both",
          "@keyframes spinnerEntry": {
            "0%": {
              opacity: 0,
              transform: "scale(0.5)",
            },
            "100%": {
              opacity: 1,
              transform: "scale(1)",
            },
          },
        }}
      >
        {/* Outer rotating ring */}
        <CircularProgress
          size={80}
          thickness={3}
          sx={{
            color: colors.accent,
            position: "absolute",
            animation: "rotateClockwise 2s linear infinite",
            "@keyframes rotateClockwise": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        />

        {/* Inner rotating ring (opposite direction) */}
        <CircularProgress
          variant="determinate"
          value={75}
          size={60}
          thickness={4}
          sx={{
            color: colors.secondary,
            position: "absolute",
            animation: "rotateCounterClockwise 3s linear infinite",
            "@keyframes rotateCounterClockwise": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(-360deg)" },
            },
          }}
        />

        {/* Center dot */}
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: colors.accent,
            boxShadow: `0 0 15px ${colors.accent}99`,
            animation: "centerPulse 1.5s ease-in-out infinite",
            "@keyframes centerPulse": {
              "0%, 100%": {
                transform: "scale(1)",
                boxShadow: `0 0 15px ${colors.accent}99`,
              },
              "50%": {
                transform: "scale(1.3)",
                boxShadow: `0 0 25px ${colors.accent}`,
              },
            },
          }}
        />
      </Box>

      {/* Loading Text */}
      <Box
        sx={{
          mt: 5,
          textAlign: "center",
          animation: "fadeInUp 0.6s ease-out 0.4s both",
          "@keyframes fadeInUp": {
            "0%": {
              opacity: 0,
              transform: "translateY(10px)",
            },
            "100%": {
              opacity: 1,
              transform: "translateY(0)",
            },
          },
        }}
      >
        <Box
          component="p"
          sx={{
            fontSize: { xs: "16px", sm: "18px" },
            fontWeight: 600,
            color: colors.accent,
            margin: 0,
            letterSpacing: "2px",
            textTransform: "uppercase",
            textShadow: `0 2px 10px rgba(0, 0, 0, 0.3)`,
            animation: "textBlink 2s ease-in-out infinite",
            "@keyframes textBlink": {
              "0%, 100%": {
                opacity: 0.7,
              },
              "50%": {
                opacity: 1,
              },
            },
          }}
        >
          Loading
        </Box>
        <Box
          component="p"
          sx={{
            fontSize: { xs: "12px", sm: "13px" },
            color: colors.secondary,
            margin: "8px 0 0 0",
            letterSpacing: "1px",
            fontWeight: 400,
          }}
        >
          Please wait while we prepare your dashboard...
        </Box>
      </Box>

      {/* Floating particles background */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {[...Array(5)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "rgba(255, 250, 205, 0.6)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: "0 0 10px rgba(255, 250, 205, 0.4)",
              animation: `floatParticle ${3 + i}s ease-in-out infinite`,
              "@keyframes floatParticle": {
                "0%": {
                  transform: `translate(0, 0) scale(1)`,
                  opacity: 0,
                },
                "10%": {
                  opacity: 1,
                },
                "90%": {
                  opacity: 1,
                },
                "100%": {
                  transform: `translate(${Math.random() * 100 - 50}px, -${Math.random() * 200}px) scale(0)`,
                  opacity: 0,
                },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
