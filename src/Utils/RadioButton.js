export const RadioButton = (props) => {
    const { changed, id, isSelected, label, value } = props;
    return (
        <div  >
                <input

                    className="new-control-input"
                    id={id}
                    onChange={changed}
                    value={value}
                    type="radio"
                    checked={isSelected}
                />
            <label htmlFor={id} className="new-control new-radio new-radio-text radio-classic-primary ml-2 mr-2">{label}</label>
                
        </div>
    );
};
