import { Form, Checkbox } from 'semantic-ui-react';

export type ColorControlOption = 'white' | 'random' | 'location' | 'original';

type ColorControlsProps = {
    colorOption: ColorControlOption;
    setColorOption: (option: ColorControlOption) => any;
};

export const ColorControls = ({
    colorOption,
    setColorOption,
}: ColorControlsProps) => {
    return (
        <>
            <h3>Preview Colors</h3>
            <Form>
                <Form.Field>
                    <Checkbox
                        radio
                        label="Original"
                        name="checkboxRadioGroup"
                        value="original"
                        checked={colorOption === 'original'}
                        onChange={() => setColorOption('original')}
                    />
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        radio
                        label="White"
                        name="checkboxRadioGroup"
                        value="white"
                        checked={colorOption === 'white'}
                        onChange={() => setColorOption('white')}
                    />
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        radio
                        label="Random Colors"
                        name="checkboxRadioGroup"
                        value="random"
                        checked={colorOption === 'random'}
                        onChange={() => setColorOption('random')}
                    />
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        radio
                        label="Color By Location"
                        name="checkboxRadioGroup"
                        value="location"
                        checked={colorOption === 'location'}
                        onChange={() => setColorOption('location')}
                    />
                </Form.Field>
                <Form.Field>
                    These options can help you find problems such as two pieces
                    being connected. When you import the pattern it will use the
                    original colors.
                </Form.Field>
            </Form>
        </>
    );
};
