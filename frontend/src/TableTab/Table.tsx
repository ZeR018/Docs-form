import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import React, { useEffect } from 'react';
import { url } from '../constants';
import { CircularProgress } from '@mui/material';

function createData(
  docName: string,
  numRequests: number,
) {
  return { docName, numRequests};
}

export default function TableTab(props : {status: number}) {
  const addDocStatus = props.status;
  const [rows, setRows] = React.useState<{docName: string, numRequests: number,}[]>([])
  useEffect(() => {changeTableData()}, [addDocStatus])

  const changeTableData = async () => {
    
    const response = await axios.get(url + 'requests/');
    const res : {id: number, constructorId: number, docName: string}[] | undefined = response.data
    // [{id, constructorId, docName},{...}]
    if (!res) {
      return;
    }
    const documents : {docName: string, numRequests: number}[] = [];
    res.forEach(r => {
      const findedElInDocArray = documents.find((d) => d.docName === r.docName)
      if (!findedElInDocArray) {
        documents.push({docName: r.docName, numRequests: 1});
      }
      else {
        documents.find(d => {
          if (d.docName === findedElInDocArray.docName)
            d.numRequests++;
        })
      }
    })
    documents.sort((a, b) => {
      if (a.numRequests > b.numRequests) {
        return -1
      }
    })
    setRows(documents.map(d => createData(d.docName, d.numRequests)))
  }
  return (
    <>
    {
      rows.length !== 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Наименование документа</TableCell>
                <TableCell>Количество заявок</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.docName}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.docName}
                  </TableCell>
                  <TableCell>{row.numRequests}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (<CircularProgress/>)
    } 
    </>
  );
}