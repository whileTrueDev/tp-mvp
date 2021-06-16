import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  logoImg: {
    margin: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
}));
/*
AvatarWithNameProps
**********************************************************************************
AvatarWithName을 위한 props입니다.
**********************************************************************************
1. logo : logo props입니다.
2. name : name props입니다. 
**********************************************************************************
 */
export interface AvatarWithNameProps {
 logo: string, name: string, size?: number
}

/*
AvatarWithName
**********************************************************************************
<개요>
avatar를 보여주는 컴포넌트입니다.
**********************************************************************************
 */
export default function AvatarWithName(props: AvatarWithNameProps): JSX.Element {
  const classes = useStyles();
  const { logo, name, size } = props;
  return (
    <div className={classes.root}>
      {logo ? (
        <Avatar
          style={size ? { width: size, height: size } : {}}
          alt={`${name}_logo`}
          src={logo}
          className={classes.logoImg}
        />
      ) : (
        <Avatar
          style={size ? { width: size, height: size } : {}}
          className={classes.logoImg}
        >
          {name && name.slice(0, 2)}
        </Avatar>
      )}
      <Typography variant="subtitle1">{name}</Typography>
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
