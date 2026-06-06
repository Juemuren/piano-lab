import {
  BlockMath as KatexBlockMath,
  type MathComponentProps,
} from 'react-katex';

function BlockMath(props: MathComponentProps) {
  return (
    <div className="overflow-x-auto">
      <KatexBlockMath {...props} />
    </div>
  );
}

export default BlockMath;
