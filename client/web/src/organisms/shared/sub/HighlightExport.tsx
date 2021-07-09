import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '../../../atoms/Button/Button';
import { ExportClickOptions } from '../../../utils/hooks/useHighlightExport';

interface HighlightExportProps {
  isChecked: {
    srtCheckBox: boolean;
    csvCheckBox: boolean;
  },
  handleCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleExportClick: (options: ExportClickOptions) => Promise<void>,
}

export default function HighlightExport(
  {
    isChecked, handleCheckbox, handleExportClick,
  }: HighlightExportProps,
): JSX.Element {
  return (
    <div>
      <div>
        <FormControlLabel
          control={(
            <Checkbox
              checked={isChecked.srtCheckBox}
              onChange={handleCheckbox}
              name="srtCheckBox"
              color="primary"
            />
          )}
          label="srt"
        />
        {/* <FormControlLabel
          control={(
            <Checkbox
              checked={isChecked.txtCheckBox}
              onChange={handleCheckbox}
              name="txtCheckBox"
              color="primary"
            />
          )}
          label="txt"
        /> */}

        <FormControlLabel
          control={(
            <Checkbox
              checked={isChecked.csvCheckBox}
              onChange={handleCheckbox}
              name="csvCheckBox"
              color="primary"
            />
          )}
          label="csv"
        />
        <Button
          onClick={() => handleExportClick({ partialExport: false })}
          disabled={!(isChecked.srtCheckBox || isChecked.csvCheckBox)} // isChecked.txtCheckBox
        >
          편집점 내보내기
        </Button>
      </div>

    </div>
  );
}
