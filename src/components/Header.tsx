import React from 'react';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <>
      {/* App Bar */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main' }}>
        <Toolbar sx={{ minHeight: { xs: 48, sm: 64 }, py: { xs: 0.5, sm: 1 } }}>
          <LocationIcon sx={{ mr: 1, fontSize: { xs: 18, sm: 24 } }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontSize: { xs: '0.875rem', sm: '1.25rem' },
              fontWeight: { xs: 500, sm: 600 }
            }}
          >
            Location Based Notes
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        py: { xs: 2, sm: 6, md: 8 }, 
        textAlign: 'center' 
      }}>
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{ mb: { xs: 1, sm: 3 } }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              opacity: 0.9,
              fontSize: { xs: '0.875rem', sm: '1.25rem' }
            }}
          >
            {subtitle}
          </Typography>
        </Container>
      </Box>
    </>
  );
};

export default Header; 