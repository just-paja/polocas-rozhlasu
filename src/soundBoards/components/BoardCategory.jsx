import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import React from 'react'

import { Category } from '../../soundCategories/components'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  gridItem: {
    margin: theme.spacing(1)
  }
})

const BoardCategoryComponent = ({
  classes,
  children,
  focused,
  focusedSound,
  onSoundPickerOpen,
  uuid
}) => (
  <Grid xs={12} sm={6} md={4} lg={3} xl={2} item elevation={0}>
    <div className={classes.gridItem}>
      {uuid
        ? (
          <Category
            focused={!focusedSound && focused}
            focusedSound={focusedSound}
            onSoundPickerOpen={onSoundPickerOpen}
            uuid={uuid}
          />
        )
        : children
      }
    </div>
  </Grid>
)

BoardCategoryComponent.displayName = 'BoardCategory'
BoardCategoryComponent.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  focused: PropTypes.bool,
  onSoundPickerOpen: PropTypes.func,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  uuid: PropTypes.string
}

BoardCategoryComponent.defaultProps = {
  children: null,
  focused: false,
  uuid: null
}

export const BoardCategory = withStyles(styles)(BoardCategoryComponent)
