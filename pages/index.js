import Head from "next/head";
import { useState, useId, Fragment } from "react";
import { Slider, Grid, Box, Container, TextField, Select, InputLabel,MenuItem,Button, LinearProgress, Tooltip, Stack, FormControl, DialogTitle, DialogContent, Divider,DialogContentText,Dialog, DialogActions  } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import { Send } from "@mui/icons-material";
import DocumentTable from "./docTable";
import TemporaryDrawer from "./sidebar";



export default function Home() {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';


  const [result, setResult] = useState();
  const [modelName, setModelName] = useState('gpt-3.5-turbo');
  const modelChoiceId = useId();
  const temperatureId = useId();
  const presencePenaltyId = useId();
  const frequencyPenaltyId = useId();
  const [show, setShow] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [maxLength, setMaxLength] = useState(2000);
  const [temperature, setTemperature] = useState(0.0);
  const [presencePenalty, setPresencePenalty] = useState(0.1);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.1);
  const [openDocDialog, setOpenDocDialog] = useState(false);
  const initialStr = `Write a short story with below hints
Q: Hello, can you pick me up at railway station tomorrow?
A: Sorry, but I can't.
Q: Why not?
A: I'm not available tomorrow.
Q: What's your plan? and when will you be available?`;
  const [questionInput, setQuestionInput] = useState(initialStr);

  const GPTModelConfig = {
    // this model field is required
    model: "text-davinci-003",
    // add your ChatGPT model parameters below
    temperature: 1.0,
    max_tokens:2000,
    presence_penalty:0.5,
    frequency_penalty:0.2
  };



  const handleClickOpen = () => {
    setOpenDocDialog(true);
  };

  const handleClose = () => {
    setOpenDocDialog(false);
  };

  async function onSubmit(event) {
    event.preventDefault();
    const runtimeCfg = { ...GPTModelConfig, model: modelName,
      temperature: temperature,
      presence_penalty: presencePenalty,
      frequency_penalty: frequencyPenalty,
      max_tokens: parseInt(maxLength)
    };
    try {
      setShowResponse(true);
      setShow(true);
      setResult('');
      if (questionInput.trim().length === 0) {
        setResult('Please provide your input...');
        setShow(false);
        return;
      }
      console.log(event.target);
      const messages = [
        {
            'role': 'system',
            'content': 'You are a helpful assistant.'
        },
        {
          'role': 'assistant',
          'content': `${result}`
        },
        {
            'role': 'user',
            'content': questionInput
        }
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...runtimeCfg, messages: messages }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setShow(false);
      setResult(data.result);
    } catch(error) {
      setShow(false);
      // Consider implementing your own error handling logic here
      console.error(error);
      //alert(error.message);
      setResult(error.message);
    }
  }

  return (
    
    <Fragment>
            <Head>
        <title>OpenAI Completions Sandbox</title>
      </Head>
    <CssBaseline />
    <Container maxWidth="xl">
      <Grid container spacing={1}>

        <Grid item xs={12} align='center'>
        
        <h3>Ask me anything</h3> 
        </Grid>
        <Grid item xs={8} >

        <Tooltip title="The prompt(s) to generate completions for, encoded as a string, array of strings, array of tokens, or array of token arrays." >
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
          <input type="hidden" name="modelName" value={modelName} />
          <Grid container >

          <Stack direction="row">
            <FormControl>
          <Tooltip title="ID of the model to use" >
          <InputLabel id={modelChoiceId}>Model</InputLabel>
          </Tooltip>
          <Select name="modelChoice" id={modelChoiceId} value={modelName} variant="outlined" 
              label="Model"
              onChange={e => setModelName(e.target.value)} >
                <Divider textAlign="right">Chat</Divider>
            <MenuItem value="gpt-3.5-turbo">gpt-3.5-turbo</MenuItem>
            <MenuItem value="gpt-3.5-turbo-0301">gpt-3.5-turbo-0301</MenuItem>
          </Select>
          </FormControl>


          <Tooltip title="The maximum number of tokens to generate in the completion.">
          <TextField
              id="maxLength"
              name="max_token"
              label="Max token"
              placeholder="Max token"
              value={maxLength}
              type="number"
              variant="outlined"
              onChange={(e) => setMaxLength(e.target.value)}
            />
          </Tooltip>

          <div >
      <Button variant="text" size="large" onClick={handleClickOpen}>?</Button>
      <Dialog
        open={openDocDialog}
        onClose={handleClose}
        maxWidth="lg" 
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >

        <DialogContent >
          <DialogContentText id="alert-dialog-description">
            OpenAI API documents are available below.
            <DocumentTable></DocumentTable>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
          </Stack>
          <TemporaryDrawer ></TemporaryDrawer>
          </Grid>
          
          <Grid container >
          <InputLabel htmlFor={temperatureId} >Temperature</InputLabel>
          <Tooltip title="What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic." >
          <Slider name='temperature' id={temperatureId} defaultValue={1.0} aria-label="temperature" valueLabelDisplay="auto" 
              max={2.0}
              min={0.0}
              step={0.1}
              marks
              onChange={(e) => setTemperature(e.target.value)}
              size="small"/>
          </Tooltip>

          <InputLabel htmlFor={presencePenaltyId} >Presence penalty</InputLabel>
          <Tooltip title="Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.">
          <Slider name='presence_penalty' id={presencePenaltyId} defaultValue={0.2} aria-label="presence_penalty" valueLabelDisplay="auto" 
              max={2.0}
              min={-2.0}
              step={0.1}
              marks
              placeholder=""
              onChange={(e) => setPresencePenalty(e.target.value)}
              size="small"/>
          </Tooltip>

          <InputLabel htmlFor={frequencyPenaltyId} >Frequency penalty</InputLabel>
          <Tooltip title="Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.">
          <Slider name='frequency_penalty' id={frequencyPenaltyId} defaultValue={0.2} aria-label="frequency_penalty" valueLabelDisplay="auto" 
              max={2.0}
              min={-2.0}
              step={0.1}
              placeholder="."
              marks
              onChange={(e) => setFrequencyPenalty(e.target.value)}
              size="small"/>
          </Tooltip>

          
          <Button type="Submit" variant="contained" endIcon={<Send></Send>}>Submit </Button>
          {
            show && (    <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>  )
          }
          </Grid>
          </form>
          </Grid>

          {showResponse && (
          <Grid item xs={12} >
          <TextField 
            InputProps={{
              readOnly: true,
            }}
            label="Response"
            value={result}
            minRows={10}
            fullWidth
            multiline
          ></TextField>
        </Grid>
          )}

        </Grid>

    </Container>
    </Fragment>
  );
}
