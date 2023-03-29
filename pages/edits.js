import Head from "next/head";
import { useState, useId, Fragment } from "react";
import { Slider, Grid, Box, Container, TextField, Select, InputLabel,MenuItem,Button, LinearProgress, Tooltip, Stack, FormControl, DialogTitle, DialogContent, Divider,DialogContentText,Dialog, DialogActions  } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline';
import { Send } from "@mui/icons-material";
import DocumentTable from "./docTable";
import TemporaryDrawer from "./sidebar";

export default function Home() {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

  const [questionInput, setQuestionInput] = useState("What day of the wek is it?");
  const [instructionInput, setInstructionInput] = useState("Fix the spelling mistakes");
  const [result, setResult] = useState();
  const [modelName, setModelName] = useState('text-davinci-edit-001');
  const modelChoiceId = useId();
  const temperatureId = useId();
  const [openDocDialog, setOpenDocDialog] = useState(false);
  const instructionId = useId();
  const [show, setShow] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [temperature, setTemperature] = useState(0.0);

  const GPTModelConfig = {
    // this model field is required
    // add your ChatGPT model parameters below
    temperature: 0.1,
  };

  const handleClickOpen = () => {
    setOpenDocDialog(true);
  };

  const handleClose = () => {
    setOpenDocDialog(false);
  };

  async function onSubmit(event) {
    event.preventDefault();
    const runtimeCfg = { ...GPTModelConfig, model: modelName, temperature: temperature};
    setShowResponse(true);
    try {
      setShow(true);
      const response = await fetch("/api/edits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...runtimeCfg, input: questionInput, instruction: instructionInput}),
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
        <title>OpenAI Edits Sandbox</title>
        <link rel="icon" href="https://www.paypalobjects.com/webstatic/icon/pp32.png" />
      </Head>
    <CssBaseline />
    <Container maxWidth="xl">
        <Grid container spacing={1}>

          <Grid item xs={12} align='center'>

            <h3>Ask me anything</h3>
          </Grid>
          <Grid item xs={8} >
            <Stack direction="column">
            <Tooltip title="The input text to use as a starting point for the edit." >
        <TextField
          id="instruction"
          name="instruction"
          label="input your instruction"
          placeholder="input your instruction"
          minRows={3}
          fullWidth
          required
          multiline
          value={instructionInput}
          onChange={(e) => setInstructionInput(e.target.value)}
        />
        </Tooltip>
        <Divider  />
        <Tooltip title="The instruction that tells the model how to edit the prompt." >
        <TextField
          id={instructionId}
          name="input"
          label="provide your input if any"
          placeholder="provide your input if any"
          minRows={5}
          fullWidth
          multiline
          value={questionInput}
          onChange={(e) => setQuestionInput(e.target.value)}
        />
        </Tooltip>
            </Stack>
          </Grid>
          <Grid item xs={4}>
          <form onSubmit={onSubmit}>
          <input type="hidden" name="modelName" value={modelName} />
          <Stack direction="row">
          <FormControl>
          <Tooltip title="ID of the model to use" >
          <InputLabel id={modelChoiceId}>Model</InputLabel>
          </Tooltip>
          <Select name="modelChoice" id={modelChoiceId} value={modelName} variant="outlined" 
              label="Model"
              onChange={e => setModelName(e.target.value)} >
            <MenuItem value="text-davinci-edit-001">text-davinci-edit-001</MenuItem>
            <MenuItem value="code-davinci-edit-001">code-davinci-edit-001</MenuItem>
          </Select>
          </FormControl>

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

    <TemporaryDrawer ></TemporaryDrawer>
    </Stack>
    <div>
    <InputLabel htmlFor={temperatureId} >Temperature</InputLabel>
          <Tooltip title="What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic." >
          <Slider name='temperature' id={temperatureId} defaultValue={0.0} aria-label="temperature" valueLabelDisplay="auto" 
              max={2.0}
              min={0.0}
              step={0.1}
              marks
              onChange={(e) => setTemperature(e.target.value)}
              size="small"/>
          </Tooltip>
          </div>
    <Button type="Submit" variant="contained" endIcon={<Send></Send>}>Submit </Button>
          {
            show && (    <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>  )
          }
          </form>
          </Grid>

          {showResponse && (
          <Grid item xs={12} >
          <TextField 
            InputProps={{
              readOnly: true,
            }}
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
