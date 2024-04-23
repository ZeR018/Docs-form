import React, { ChangeEvent, useEffect } from 'react';
import { backdropClasses, Button, CircularProgress, FormControl, InputLabel, 
  MenuItem, Select, SelectChangeEvent, 
  Stack, TextField, Typography } from '@mui/material'
import axios from 'axios';
import { url } from '../constants';
import { statusProps } from '../App';

type peopleStateType = {
  id: number,
  fullname: string,
}

const typoStyle409 = {
  backgroundColor: "LightCoral",
  borderRadius: 5,
  padding: 5,
  opacity: 1,
  transition: "opacity 5s ease-in-out"
}

const typoStyle200 = {
  backgroundColor: "GreenYellow",
  borderRadius: 5,
  padding: 5,
  opacity: 1,
  transition: "opacity 5s ease-in-out"
}

export default function FormTab(props : statusProps) {
  const addDocStatus = props.status;
  const setAddDocStatus = props.setStatus;
  
  const [people, setPeople] = React.useState<peopleStateType[]>([]);
  const [id, setId] = React.useState('')
  const [docName, setDocName] = React.useState('')
  const handleChange = (event: SelectChangeEvent) => {
    setId(event.target.value);
  };
  const textFieldChange = (event : ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setDocName(event.target.value)
  }

  useEffect(() => {getConstructors()}, [])

  const getConstructors = async () => {
    const response = await axios.get(url + 'constructors/')
    const res = response.data
    setPeople(res)
    setId(res[0].id)
  }

  const makeRequest = async () => {
    if (!docName) {
      return
    }
    await axios({
      method: 'POST',
      url: url + 'requests/',
      data: {
        "constructorId": id,
        "docName": docName
      }
    }).then((res) => {
      setAddDocStatus(res.status)
      setDocName('')
    }).catch((error) => {
      console.log(error)
      if (error === undefined) {
        return;
      }
      else {
        setAddDocStatus(409);
      }
    });
  }
  return (
    <>
    {
      people.length !== 0 ? (
      <Stack gap="15px" width={600}>
        <FormControl fullWidth>
          
          <InputLabel id="demo-simple-select-label">ФИО конструктора</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={id}
            label="ФИО конструктора"
            onChange={handleChange}
          >
            {
              people.map((p, i) => <MenuItem key={`menu_item_${id}_${i}`} value={p.id}>{p.fullname}</MenuItem>)
            }
          </Select>
        </FormControl>
        <TextField id="outlined-basic" label="Наименование документа" variant="outlined" value={docName} onChange={textFieldChange}/>
        <Button variant="contained" onClick={makeRequest}>Отправить</Button>
        { addDocStatus == 409 && <Typography style={typoStyle409}>Ошибка, запрос на этот документ от этого конструктора уже зарегистрирован</Typography>}
        { addDocStatus == 200 && <Typography style={typoStyle200}>Запрос успешно отправлен!</Typography>}
      </Stack>
      ) : (<CircularProgress/>)
    }
    </>
  )
}
