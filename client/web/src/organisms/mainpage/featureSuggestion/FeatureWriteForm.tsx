import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '../../../atoms/Button/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: theme.spacing(8),
    justifyContent: 'center',
    alighItems: 'center'
  },

  form: {
    width: '70%',
  },
  title: {
    margin: theme.spacing(3)
  },
  titleInput: {
    width: '400px'
  },
  contents: {
    margin: theme.spacing(3)
  }
}));

export default function FeatureWriteForm() {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = React.useState(null);
  const handleImageUpload = () => {
    setSelectedFile(selectedFile);
  };
  return (
    <div className={classes.root}>
      <Typography className={classes.contents} variant="h4">글쓰기</Typography>
      <div className={classes.contents}>
        <TextField
          className={classes.titleInput}
          id="standard-multiline-flexible"
          rowsMax={1}
          variant="outlined"
          placeholder="제목을 입력해주세요."
        />
      </div>
      <div className={classes.contents}>
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-age-native-simple">카테고리</InputLabel>
          <Select
            native
            label="카테고리"
            inputProps={{
              name: '카테고리',
              id: 'outlined-age-native-simple',
            }}
          >
            <option value={10}>홈페이지 개선</option>
            <option value={20}>편집전 관련</option>
            <option value={30}>기타</option>
          </Select>
        </FormControl>
      </div>
      <div className={classes.contents}>
        <TextField
          className={classes.form}
          id="outlined-multiline-static"
          multiline
          rows={20}
          placeholder="내용을 입력해주세요."
          variant="outlined"
        />
      </div>
      <div>
        <Button className={classes.contents}>
          <input type="file" name="file" onChange={handleImageUpload} />
        </Button>
      </div>
    </div>
  );
}
