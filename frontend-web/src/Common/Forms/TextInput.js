import React from 'react';

const TextInput = props => {

    let formControl = "ui input";

    if (props.touched && !props.valid) {
        formControl = 'ui input error';
    }

    return (
        <div className="form-group">
            <input type="text" className={formControl} {...props} />
        </div>
    );
};

export default TextInput;


{/*<div className="form-group">*/}
{/*    <input type="text" className={formControl} {...props} />*/}
{/*    <div className="ui basic red pointing prompt label transition visible">Please enter your name</div>*/}
{/*</div>*/}