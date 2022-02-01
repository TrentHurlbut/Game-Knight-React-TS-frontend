import { Box, Button, Typography, Grid } from '@mui/material';
import FeatureBlock from '../components/FeatureBlock';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const handleClickToReg = () => {
    navigate('/registration/');
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box
              className="home-screen-left"
              sx={{ marginLeft: 12, marginTop: 12 }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 'bolder',
                  textAlign: 'center',
                  fontFamily: 'Open Sans',
                }}
              >
                Some Big Text Words
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  marginLeft: 10,
                  marginRight: 10,
                  marginTop: 6,
                  marginBottom: 6,
                  fontFamily: 'Open Sans',
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
                sodales, magna commodo gravida vestibulum, leo nisl viverra
                neque, id hendrerit.
              </Typography>
              <Button
                variant="contained"
                sx={{ p: 3, display: 'block', margin: 'auto' }}
                onClick={handleClickToReg}
              >
                <Typography variant="h6">Register Now</Typography>
              </Button>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              className="home-screen-right"
              sx={{ marginRight: 12, marginTop: 12 }}
            >
              <img
                className="home-image"
                src="/meeples.jpeg"
                alt="Board game"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box className="home-screen-upper-box" sx={{ display: 'inline' }}></Box>
      <Box className="feature-list" sx={{ backgroundColor: '#759eb8' }}>
        <FeatureBlock
          featureIcon="/icon1.svg"
          featureName="Plan your game nights"
          featureDetails="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, magna commodo gravida vestibulum, leo nisl viverra neque, id hendrerit."
        />
        <FeatureBlock
          featureIcon="/icon2.svg"
          featureName="Collect feedback"
          featureDetails="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, magna commodo gravida vestibulum, leo nisl viverra neque, id hendrerit."
        />
        <FeatureBlock
          featureIcon="/icon3.svg"
          featureName="Track your play stats"
          featureDetails="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, magna commodo gravida vestibulum, leo nisl viverra neque, id hendrerit."
        />
        <FeatureBlock
          featureIcon="/icon4.svg"
          featureName="Make hosting easy"
          featureDetails="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, magna commodo gravida vestibulum, leo nisl viverra neque, id hendrerit."
        />
        <FeatureBlock
          featureIcon="/icon5.svg"
          featureName="Play more of your games"
          featureDetails="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, magna commodo gravida vestibulum, leo nisl viverra neque, id hendrerit."
        />
        <FeatureBlock
          featureIcon="/icon6.svg"
          featureName="Organize your collection"
          featureDetails="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales, magna commodo gravida vestibulum, leo nisl viverra neque, id hendrerit."
        />
      </Box>
    </>
  );
}
