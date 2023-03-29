import Head from "next/head";
import { useState, useId, Fragment } from "react";
import { Slider, Grid, Container, TextField, Select, InputLabel,MenuItem,Button, LinearProgress, Tooltip, FormControl, Box, ImageList, ImageListItem, Stack  } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import { Send } from "@mui/icons-material";
import TemporaryDrawer from "./sidebar";


export default function Home() {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

  const [questionInput, setQuestionInput] = useState("an orange cat, playing toy mice");
  const [result, setResult] = useState();
  const [sizeName, setSizeName] = useState('256x256');
  const [formatName, setFormatName] = useState('url');
  const sizeChoiceId = useId();
  const numberOfImagesId = useId();
  const [numberOfImages, setNumberOfImages] = useState(1);
  const [show, setShow] = useState(false);
  const [showResponse, setShowResponse] = useState(false);



  const GPTModelConfig = {
    prompt: '',
    response_format: 'url'
  };

  async function onSubmit(event) {
    event.preventDefault();
    const runtimeCfg = { ...GPTModelConfig,
      prompt: questionInput,
      response_format: formatName,
      size: sizeName,
      n: parseInt(numberOfImages)
    };
    try {
      setShow(true);
      setResult('');

      const response = await fetch("/api/imageGeneration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...runtimeCfg }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setShow(false);
      setShowResponse(true);
      setResult(data.result);
    } catch(error) {
      setShow(false);
      // Consider implementing your own error handling logic here
      console.error(error);
      //alert(error.message);
      setResult(error.message);
      setShowResponse(true);
    }
  }

  return (
    
    <Fragment>
            <Head>
        <title>OpenAI Image Sandbox</title>
      </Head>
    <CssBaseline />
    <Container maxWidth="xl">
      <Grid container spacing={1}>

        <Grid item xs={12} align='center'>
        
        <h3>Ask me anything for images</h3> 
        </Grid>
        <Grid item xs={8} >

        <Tooltip title="A text description of the desired image(s). The maximum length is 1000 characters" >
        <TextField
          id="question"
          name="question"
          label="input your question"
          placeholder="input your question"
          minRows={12}
          fullWidth
          required
          multiline
          value={questionInput}
          onChange={(e) => setQuestionInput(e.target.value)}
        />
        </Tooltip>

          </Grid>
          <Grid item xs={4} >
          <form onSubmit={onSubmit}>
          <input type="hidden" name="sizeName" value={sizeName} />
          <Stack direction="row">
          <FormControl >
          <InputLabel id={sizeChoiceId} >Size</InputLabel>
          <Select name="sizeChoice" labelId={sizeChoiceId} value={sizeName} 
            label="Size"
            onChange={e => setSizeName(e.target.value)} >
            <MenuItem value="1024x1024">1024x1024</MenuItem>
            <MenuItem value="512x512">512x512</MenuItem>
            <MenuItem value="256x256">256x256</MenuItem>
          </Select>
          </FormControl>

          <FormControl >
          <InputLabel id="imageFormat">Format</InputLabel>
          <Select name="sizeChoice" labelId="imageFormat" value={formatName} 
            label="Format"
            onChange={e => setFormatName(e.target.value)} >
            <MenuItem value="url">url</MenuItem>
            <MenuItem value="b64_json" disabled>b64_json</MenuItem>
          </Select>
          </FormControl>
          <TemporaryDrawer ></TemporaryDrawer></Stack>
          
          <InputLabel htmlFor={numberOfImagesId} >Number of Images</InputLabel>
          <Slider name="number_of_images" id={numberOfImagesId} value={numberOfImages} 
              valueLabelDisplay="auto" 
              aria-label="number_of_images"
              max={10}
              min={1}
              step={1}
              marks
              onChange={(e) => setNumberOfImages(e.target.value)}
              size="small"/>
          

         <Button type="Submit" variant="contained" endIcon={<Send></Send>}>Submit </Button>
         {
            show && (    <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>  )
          }
          </form>
          </Grid>

          {showResponse && (
            <Box >
          <Grid item xs={12} >
            {result instanceof Array ? (
                        <ImageList  cols={3} >
                        {result.map((item) => (
                          <ImageListItem key={item.url}>
                            <img
                              src={item.url}
                              srcSet={item.url}
                              alt={item.url}
                              loading="lazy"
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
            )
            :
            (
          <TextField 
          InputProps={{
            readOnly: true,
          }}
          label="Response"
          value={result}
          fullWidth
          multiline
        ></TextField>
            )}

        </Grid>
        </Box>
          )}

        </Grid>

    </Container>
    </Fragment>
  );
}
