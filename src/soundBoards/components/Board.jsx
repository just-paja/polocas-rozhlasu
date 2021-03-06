import classnames from 'classnames'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'

import { BoardCategory } from './BoardCategory'
import { BoardEmpty } from './BoardEmpty'
import { boardRoutines } from '../actions'
import { BoardSpeedDial } from './BoardSpeedDial'
import { categoryRoutines } from '../../soundCategories'
import { connect } from 'react-redux'
import { connectSoundDropTarget } from '../../sounds/containers'
import { getBoardCategoryUuids } from '../selectors'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  board: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  gridSpacing: {
    minWidth: 320,
    padding: theme.spacing(1)
  },
  canDrop: {
    background: theme.palette.dropTarget
  }
})

const renderSnackbar = (isOver, canDrop) => (
  <Snackbar
    open={canDrop && isOver}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    message='Drop sounds here to create a new category'
  />
)

class BoardComponent extends React.PureComponent {
  isFocused (categoryUuid, categoryIndex) {
    const { focusedCategory } = this.props
    return (
      focusedCategory === categoryUuid ||
      (!focusedCategory && categoryIndex === 0)
    )
  }

  renderCategories () {
    const {
      categories,
      classes,
      focusedSound,
      onSoundPickerOpen
    } = this.props
    return (
      <Grid alignItems='flex-start' className={classes.gridSpacing} container>
        {categories.map((categoryUuid, index) => (
          <BoardCategory
            focused={this.isFocused(categoryUuid, index)}
            focusedSound={focusedSound}
            key={categoryUuid}
            onSoundPickerOpen={onSoundPickerOpen}
            uuid={categoryUuid}
          />
        ))}
      </Grid>
    )
  }

  render () {
    const {
      canDrop,
      categories,
      classes,
      connectDropTarget,
      isOver,
      uuid
    } = this.props
    // Wrapping div is necessary for react-dnd
    return connectDropTarget(
      <div
        className={classnames(classes.board, {
          [classes.canDrop]: isOver && canDrop
        })}
      >
        {categories.length > 0
          ? this.renderCategories()
          : <BoardEmpty board={uuid} />
        }
        {renderSnackbar(isOver, canDrop)}
        <BoardSpeedDial boardUuid={uuid} />
      </div>
    )
  };
};

BoardComponent.displayName = 'Board'
BoardComponent.propTypes = {
  canDrop: PropTypes.bool,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  focusedCategory: PropTypes.string,
  isOver: PropTypes.bool,
  showCreateForm: PropTypes.bool,
  uuid: PropTypes.string
}

BoardComponent.defaultProps = {
  canDrop: false,
  focusedCategory: null,
  isOver: false,
  showCreateForm: false
}

const mapStateToProps = (state, { uuid }) => ({
  categories: getBoardCategoryUuids(state, uuid)
})

const mapDispatchToProps = {
  onAdd: categoryRoutines.create,
  onDrop: boardRoutines.soundDrop
}

export const Board = connect(
  mapStateToProps,
  mapDispatchToProps
)(connectSoundDropTarget(withStyles(styles)(BoardComponent)))
