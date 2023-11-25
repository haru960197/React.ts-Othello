type Props = {
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BoardSizeRadio(props: Props) {
    const boardSizes = [6, 8, 10];

    return (
        <form>
            <fieldset>
                <legend>盤面のサイズを選択してください</legend>
                <div>
                    {boardSizes.map((size: number) => (
                        <div key={size}>
                            <input
                                type="radio"
                                id={`radio-id-${size}`}
                                value={size}
                                onChange={props.onChange}
                                checked={size === props.value}
                                 />
                            <label htmlFor={`radio-id-${size}`}>{`${size}マス`}</label>
                        </div>
                    ))}
                </div>
            </fieldset>
        </form>
    );
}