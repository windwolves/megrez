import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper';

function createData(model_name, description, max_request, training_data) {
  return { model_name, description, max_request, training_data };
}

const rows = [
    createData('text-davinci-003', 'Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text', '4,000 tokens', 'Up to Jun 2021'),
    createData('text-curie-001', 'Very capable, but faster and lower cost than Davinci', '2,048 tokens', 'Up to Oct 2019'),
    createData('text-babbage-001', 'Capable of straightforward tasks, very fast, and lower cost', '2,048 tokens', 'Up to Oct 2019'),
    createData('text-ada-001', 'Capable of very simple tasks, usually the fastest model in the GPT-3 series, and lowest cost', '2,048 tokens', 'Up to Oct 2019'),
    createData('code-davinci-002', 'Most capable Codex model. Particularly good at translating natural language to code. In addition to completing code, also supports inserting completions within code', '8,000 tokens', 'Up to Jun 2021'),
    createData('code-cushman-001', 'Almost as capable as Davinci Codex, but slightly faster. This speed advantage may make it preferable for real-time applications.', 'Up to 2,048 tokens', '')

];

export default function DocumentTable() {
  return (
    
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="document reference table">
        <TableHead>
          <TableRow>
            <TableCell>LATEST MODEL</TableCell>
            <TableCell align="right">DESCRIPTION</TableCell>
            <TableCell align="right">MAX REQUEST</TableCell>
            <TableCell align="right">TRAINING DATA</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.model_name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.model_name}
              </TableCell>
              <TableCell align="left">{row.description}</TableCell>
              <TableCell align="left">{row.max_request}</TableCell>
              <TableCell align="left">{row.training_data}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={4}>
            <Link variant="inherit" href="https://platform.openai.com/docs/models/gpt-3" target="_blank">GPT-3</Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4}>
            <Link variant="inherit" href="https://platform.openai.com/docs/models/codex" target="_blank">Codex</Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4}>
            <Link variant="inherit" href="https://platform.openai.com/docs/api-reference/completions" target="_blank" >API Doc</Link>
            </TableCell>
          </TableRow>

          
          

        </TableBody>
      </Table>
    </TableContainer>
  );
}