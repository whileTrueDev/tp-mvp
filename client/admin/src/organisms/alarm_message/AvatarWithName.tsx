import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  logoImg: {
    margin: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
}));

export default function AvatarWithName(props: any) {
  const classes = useStyles();
  const { logo, name } = props;
  return (
    <div className={classes.root}>
      {logo ? (
        <Avatar alt={`${name}_logo`} src={logo} className={classes.logoImg} />
      ) : (
        <Avatar
          className={classes.logoImg}
        >
          {name && name.slice(0, 2)}
        </Avatar>
      )}
      <Typography variant="h6">{name}</Typography>
    </div>
  );
}

AvatarWithName.propTypes = {
  name: PropTypes.string.isRequired,
  logo: PropTypes.string,
};

AvatarWithName.defaultProps = {
  logo: null,
};