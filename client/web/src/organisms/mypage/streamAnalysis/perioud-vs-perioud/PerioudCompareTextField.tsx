import React from 'react';
import { Grid, Typography, TextField ,Button,} from '@material-ui/core';
import { PerioudCompareTextBoxProps } from './PerioudCompareHero.interface';
import { DatePicker, KeyboardDatePicker,MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import MomentUtils from "@date-io/moment";
import moment from "moment";

export default function PerioudCompareTextField(props: PerioudCompareTextBoxProps): JSX.Element {
  const { base, perioud} = props;

  const [startDate, setStartDate] = React.useState<MaterialUiPickersDate>(null);
  const [endDate, setEndDate] = React.useState<MaterialUiPickersDate>(null);
  const [endDateError , setEndDateError] = React.useState<boolean>(false);

  const handleDateChange = (newDate: MaterialUiPickersDate, isStart?: true) => {
    
    if(isStart){
      setStartDate(newDate);
    }
    else{
      if(newDate && startDate){

        if(newDate.getDate() > startDate.getDate() && newDate.getMonth() > startDate.getMonth()){
          setEndDate(newDate);
        }
        else{
          setEndDateError(true);
        }
      }
    }
  }

  React.useEffect(() => {
    if(endDate){
      console.log(endDate.toISOString());
    }
  },[endDate])


  const [selectedDate, setDate] = React.useState(moment());
  const [inputValue, setInputValue] = React.useState(moment().format("YYYY-MM-DD"));

  const onDateChange = (date: MaterialUiPickersDate, value?: string | null | undefined)=> {
    if(date && value){
      setDate(moment(date));
      setInputValue(value);
    }

  };

  const dateFormatter = (str: string) => {
    return str;
  };


  return (
    <Grid container direction="row" spacing={2}>
      <Grid item>
      {/* <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
        <KeyboardDatePicker
          autoOk={true}
          style={{width: '178px',height: '35px'}}
          showTodayButton={true}
          value={selectedDate}
          format="yyyy-mm-dd hh:mm:ss"
          inputValue={inputValue}
          onChange={onDateChange}
          rifmFormatter={dateFormatter}
        />
      </MuiPickersUtilsProvider> */}
        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            style={{width: '178px',height: '35px'}}
            autoOk
            variant="inline"
            inputVariant="outlined"
            label="start"
            // rifmFormatter={ str => str}
            value={startDate}
            format="yyyy-mm-dd hh:mm:ss"
            inputProps={{ style: {width: '100%', textAlign: 'center'}}}
            onChange={(date) => handleDateChange(date,true)}
            open={false}
          />
        </MuiPickersUtilsProvider> */}
        <TextField
          style={{width: '178px',height: '35px'}}
          variant="outlined"
          type="date"
        />
      </Grid>
      <Grid item alignItems="center" style={{height: '100%'}}>
        <Typography variant="h4">
          ~
        </Typography>
      </Grid>
      <Grid item>
      {/* <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
        <KeyboardDatePicker
          autoOk={true}
          style={{width: '178px',height: '35px'}}
          showTodayButton={true}
          value={selectedDate}
          format="YYYY-MM-DD"
          inputValue={inputValue}
          onChange={onDateChange}
          rifmFormatter={dateFormatter}
        />
      </MuiPickersUtilsProvider> */}
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            style={{width: '178px',height: '35px'}}
            autoOk
            variant="inline"
            format="yyyy-mm-dd"
            error={endDateError}
            inputVariant="outlined"
            label="end"
            value={endDate}
            inputProps={{ style: {width: '100%', textAlign: 'center'}}}
            onChange={(date) => handleDateChange(date)}
            open={false}
          />
        </MuiPickersUtilsProvider>
      </Grid>
    </Grid>
  );
}
