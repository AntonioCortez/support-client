import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';

import DropDown from 'core-components/drop-down';
import Icon from 'core-components/icon';

class PaginationDropDown extends React.Component {
    static propTypes = {
        value: React.PropTypes.number,
        onChange: React.PropTypes.func,
        departments: React.PropTypes.array
    }

    render() {
        return <DropDown {...this.props} onChange={this.onChange.bind(this)} items={this.getOptions()} />
    }

    getOptions() {
        let options = this.props.options.map((option) => {
            return {content: option.name};
        });

        return options;
    }

    onChange(event) {
        if(this.props.onChange) {
            this.props.onChange({
                index: event.index,
                target: {
                    value: event.index
                }
            });
        }
    }
}

export default PaginationDropDown;