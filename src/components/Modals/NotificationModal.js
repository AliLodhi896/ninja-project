// package imports
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Modal } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(5, 10),
    top: '50vh',
    left: '50vw',
    transform: 'translate(-50%,-50%)',
    outline: 0,
    borderRadius: 4,
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  spacing: {
    marginRight: 6,
  },
}));

export default function NotificationModal(props) {
  const classes = useStyles();

  const handleClose = () => {
    props.setModal({ open: false, msg: '', status: '' });
  };

  return (
    <Modal open={props.open} onClose={handleClose}>
      <div className={classes.root}>
        <Grid container direction="row" justify="center" alignItems="center">
          {props.status === 'good' && (
            <CheckCircleIcon
              style={{ color: '#4caf50' }}
              fontSize="large"
              className={classes.spacing}
            />
          )}
          {props.status === 'bad' && (
            <CancelIcon style={{ color: '#f44336' }} fontSize="large" className={classes.spacing} />
          )}
          {props.msg}
        </Grid>
      </div>
    </Modal>
  );
}
