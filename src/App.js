import './App.css';
import UseEmail from "./UseEmail";
import { React, useState, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import _ from 'lodash';
import { borderColor, fontSize } from '@mui/system';
import { TextField } from '@mui/material';

function App() {
  const formSettings = {
    TOTAL_POINTS: 35,
    MIN_POINTS: 0,
    MAX_POINTS: 10,
    STEP_SIZE: 1
  }

  const [formComplete, setFormComplete] = useState(false);
  const [formError, setFormError] = useState(false);
  const [remainingPoints, setRemainingPoints] = useState(formSettings.TOTAL_POINTS);
  const [characterName, setCharacterName] = useState('');
  const [attributes, setAttributes] = useState({
    Steezy: 0,
    Vegetarian: 0,
    TikTok: 0,
    Insomniac: 0,
    Minecraft: 0,
    Dog_Friendly: 0,
    Oblivious: 0,
    Dad_Joke: 0
  });

  const formatString = (str) => {
    try {
      return str.replace('_', ' ');
    } catch (err) {
      return str;
    }
  }

  const updateAttributePoints = (name, value) => {
    const { TOTAL_POINTS } = formSettings;
    var points = 0;
    Object.entries(attributes)
      .forEach(([n, v]) => {
        if (n !== name) {
          points += v;
        }
      });
    if (value + points > TOTAL_POINTS) {
      _.set(attributes, name, TOTAL_POINTS - points);
      setRemainingPoints(0);
    } else {
      _.set(attributes, name, value);
      setRemainingPoints(TOTAL_POINTS - (value + points));
    }
  }

  const getAttributeSlider = (name, value) => {
    const { MIN_POINTS, MAX_POINTS, STEP_SIZE } = formSettings;
    return (
      <Grid container spacing={2}>
        <Grid item xs={11.5}>
          <Slider
            id={`slider_${formatString(name)}`}
            aria-label='Example'
            valueLabelDisplay='auto'
            getAriaValueText={
              (value) => {
                return `${value}`;
              }
            }
            onChange={
              (event, newValue) => {
                updateAttributePoints(name, newValue);
              }
            }
            value={_.get(attributes, name)}
            defaultValue={MIN_POINTS}
            step={STEP_SIZE}
            min={MIN_POINTS}
            max={MAX_POINTS}
            sx={{ color: '#87c876' }}
            marks
          />
        </Grid>
        <Grid item>
          <span className='text-m text-louis'>
            {_.get(attributes, name)}
          </span>
        </Grid>
      </Grid>
    );
  }

  const generateForm = () => {
    return Object.entries(attributes)
      .map(([name, value]) => {
        return (
          <div id={`form_${formatString(name)}`} className='container-form-question'>
            <div className='container-form-prompt'>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <span className='text-l text-louis'>
                    Not {formatString(name)}
                  </span>
                </Grid>
                <Grid item xs={6} style={{ textAlign: 'right' }}>
                  <span className='text-l text-louis'>
                    Very {formatString(name)}
                  </span>
                </Grid>
              </Grid>
            </div>
            <div className='container-form-input'>
              {getAttributeSlider(name, value)}
            </div>
          </div>
        );
      });
  }

  const downloadFile = (fileData) => {
    const { data, fileName, fileType } = fileData;
    const blob = new Blob([data], { type: fileType });
    const temp = document.createElement('a');
    temp.download = fileName;
    temp.href = window.URL.createObjectURL(blob);
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    temp.dispatchEvent(clickEvent);
    temp.remove();
  }

  const handleDownload = (event) => {
    event.preventDefault();
    sendEmail({
      data: JSON.stringify({
        characterName: characterName,
        attributes: { ...attributes, Quirkiness: remainingPoints }
      })
    });
    
    if (error) {
      setFormError(true);
    } else {
      setFormComplete(true);
    }
  }

  const {
    loading,
    submitted,
    error,
    sendEmail
  } = UseEmail('https://public.herotofu.com/v1/62c14060-d6cb-11ec-81bd-9d40629c0f02');

  return (
    <div className='container-main'>
      <div className='container-title'>
        <span className='text-bebas text-xl'>
          Personality <span style={{ color: '#87c876' }}>Survey</span>
        </span>
      </div>
      <div className='container-body' id='body'>
        <div className='formComplete text-louis' hidden={!formComplete} style={{textAlign:'center'}}>
          <h2>Thanks for submitting your form!</h2>
        </div>
        <div className='formError text-louis' hidden={!formError} style={{textAlign:'center'}}>
          <h2 style={{color: 'red'}}>An Error Occurred</h2>
          {error}
        </div>
        <div id='form' hidden={formComplete}>
          <div className='text-louis text-m' style={{
            margin: 'auto',
            width: '60%',
            backgroundColor: '#343434',
            borderRadius: '5px',
            padding: '40px',
            paddingTop: '10px'
          }}>
            <TextField
              value={characterName}
              variant='filled'
              label='Character Name'
              error={!characterName}
              required={true}
              autoFocus={true}
              fullWidth={true}
              size='normal'
              color='success'
              onChange={(event) => { setCharacterName(event.target.value); }}
              sx={{
                label: { color: '#7a7a7a', fontSize: '1.25rem' },
                input: { color: 'white', fontSize: '1.25rem', backgroundColor: '#343434' }
              }}
            />
          </div>
          <br /><br />
          <span className='text-m text-louis'>
            Remaining Points: {remainingPoints}
            <br /><br />
          </span>
          <Stack spacing={5}>
            {generateForm()}
          </Stack>
          <div className='container-button'>
            <Button
              onClick={handleDownload}
              variant='contained'
              startIcon={<SaveIcon />}
              size='large'
              disabled={!characterName || formError || formComplete}
              sx={{ backgroundColor: '#87c876', width: '200px', height: '50px' }}>
              DOWNLOAD
            </Button>
            <br /><br />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
