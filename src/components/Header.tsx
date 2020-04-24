import React from 'react'
import { fade, makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import Link from 'next/link'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

// ref: https://material-ui.com/components/app-bar/#app-bar-with-a-primary-search-field
const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: theme.spacing(2),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
  },
  homeLink: {
    backgroundColor: 'rgbs(0, 0, 0, 0.5)',
    '&:hover': {
      backgroundColor: 'rgbs(0, 0, 0, 0.8)',
    },
    color: 'black',
    textDecoration: 'none',
    '&:visited': {
      color: 'black',
    },
  },
}))

export const Header: React.FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.grow}>
      <AppBar style={{ backgroundColor: 'orange' }}>
        <Toolbar>
          <Link href="/">
            <a className={classes.homeLink}>
              <Typography variant="h6" noWrap>
                knowledgebox
              </Typography>
            </a>
          </Link>
          <div className={classes.grow} />
          <Link href="/new">
            <Fab component="a" aria-label="add" color="inherit" size="small">
              <AddIcon />
            </Fab>
          </Link>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>
    </div>
  )
}
