import { readFileSync } from 'fs';
import path from 'path';

const packageJson: {
  name: string;
  version: string;
} = JSON.parse(
  readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf-8'),
);

export default packageJson;
