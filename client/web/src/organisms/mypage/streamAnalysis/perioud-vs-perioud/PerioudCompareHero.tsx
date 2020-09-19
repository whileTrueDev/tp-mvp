import React from 'react';
// material-ui core components
import {
  Paper, Typography, Grid, Divider, Button, Collapse,
  TextField
} from '@material-ui/core';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import PerioudCompareCalendar from './PerioudCompareCalendar';
import PerioudCompareTextField from './PerioudCompareTextField';
import SelectDateIcon from '../../../../atoms/stream-analysis-icons/SelectDateIcon';
import { DayStreamsInfo } from './PerioudCompareHero.interface';

export default function PerioudCompareHero(): JSX.Element {
  const [basePerioud, setBasePerioud] = React.useState<Date[]>(new Array<Date>(2));
  const [comparePerioud, setComparePerioud] = React.useState<Date[]>(new Array<Date>(2));
  const handlePerioud = (startAt: Date, endAt: Date, base?: true) => {
    const per = [startAt, endAt];
    if(base){
      setBasePerioud(per);
    }
    else{
      setComparePerioud(per);
    }
  };

  return (
    <div>
      <Divider
        style={{ 
        backgroundColor: '#4b5ac7',
        width: '200px',
        marginBottom: '12px',
        height: '3px'}}
      />
      <Typography 
      style={{ 
        color: '#000000',
        letterSpacing: '-1.2px',
        textAlign: 'left',
        lineHeight: 1.33,
        fontWeight: 500,
        fontSize: '30px',
        fontFamily: 'AppleSDGothicNeo',
        marginBottom: '28px',}}
    >
        기간 대 기간 분석
      </Typography>
      <Typography align="right" style={{
        color:'#4d4f5c',
        fontFamily: 'AppleSDGothicNeo',
        fontSize: '12px',
        lineHeight: '1.11'
      }}>
        * 데이터 제공 기간을 벗어난 데이터는 확인하실 수 없습니다.
      </Typography>
      <Typography
         style={{ 
          color: '#4d4f5c',
          letterSpacing: '-1.2px',
          textAlign: 'left',
          lineHeight: 0.87,
          fontWeight: 500,
          fontSize: '23px',
          fontFamily: 'AppleSDGothicNeo',
          marginBottom: '28px',}}
      >
        기간별 분석을 위한 기간을 설정해 주세요.
      </Typography>
      <Grid container direction="row" xs={12} justify="center">
        <Grid item style={{ marginRight: '30px' }}>
          <PerioudCompareTextField 
            base
            perioud={basePerioud}
          />
          <Paper elevation={0} 
            style={{marginTop: '32px',border: 'solid 1px #707070', borderRadius: '10px', paddingTop: '27px',paddingBottom: '20px'}}
          >
            <Typography align="center" 
            style={{
              fontSize: '19px',
              fontFamily: 'SourceSansPro',
              lineHeight: 1.53,
              color: '#4d4f5c',
              display: 'flex',
              justifyContent: 'center'
            }}>
             <SelectDateIcon style={{ fontSize: '28px', marginRight: '10px' }} />
              <Typography style={{fontSize: '19px',fontWeight: 'bold', color: '#2f5fac',marginRight: '5px'}}>
                기준 방송
              </Typography>
              기간 선택
            </Typography>
            <PerioudCompareCalendar
              handlePerioud={handlePerioud}
              base
            />
          </Paper>
          
        </Grid>
        <Typography style={{ 
          color: '#4d4f5c',
          letterSpacing: '-1.2px',
          textAlign: 'left',
          lineHeight: 0.67,
          fontWeight: 500,
          fontSize: '30px',
          fontFamily: 'AppleSDGothicNeo',
          marginBottom: '28px',
          marginRight: '30px',
          marginTop: '20px'
          }}>
          VS
        </Typography>
        <Grid item style={{ marginRight: '30px',}}>
        <PerioudCompareTextField 
            perioud={comparePerioud}
          />
          <Paper elevation={0} 
            style={{marginTop: '32px', border: 'solid 1px #707070', borderRadius: '10px', paddingTop: '27px',paddingBottom: '20px'}}
          >
            <Typography align="center" 
            style={{
              fontSize: '19px',
              fontFamily: 'SourceSansPro',
              lineHeight: 1.53,
              color: '#4d4f5c',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <SelectDateIcon style={{ fontSize: '28px', marginRight: '18px' }} />
              <Typography style={{fontSize: '19px',fontWeight: 'bold',marginRight: '5px'}}>
                비교 방송
              </Typography>
              기간 선택
            </Typography>
            <PerioudCompareCalendar
              handlePerioud={handlePerioud}
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
