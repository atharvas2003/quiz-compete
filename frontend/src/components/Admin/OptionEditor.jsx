function OptionEditor({
    options,
    setOptions,
    correctOption,
    setCorrectOption,
}) {

    const updateOption = (index, value) => {

        const updatedOptions = [...options];

        updatedOptions[index] = value;

        setOptions(updatedOptions);

    };

    return (

        <div className="option-editor">

            <h3>Options</h3>

            {options.map((option, index) => (

                <div
                    key={index}
                    className="option-row"
                >

                    <input
                        className="input"
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) =>
                            updateOption(
                                index,
                                e.target.value
                            )
                        }
                    />

                    <label>

                        <input
                            type="radio"
                            name="correctOption"
                            checked={
                                correctOption === index
                            }
                            onChange={() =>
                                setCorrectOption(index)
                            }
                        />

                        Correct

                    </label>

                </div>

            ))}

        </div>

    );

}

export default OptionEditor;