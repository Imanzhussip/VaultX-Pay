import { useDemoLoop } from '../../hooks/useDemoLoop';
import Icon from '../Icon';
import LoopToggle from './LoopToggle';

const steps = [
  { title: 'Lock both accounts', text: 'No other payment can touch either balance.' },
  { title: 'Move the money', text: 'One balance goes down, the other goes up.' },
  { title: 'Save both together', text: 'Both changes are saved at once, or neither is.' },
];

const HOLD = steps.length + 1;
const DURATIONS = [700, 1100, 1100, 1100, 2200];

function TransferSteps() {
  const { ref: loopRef, index: loopIndex, stopped, toggle, controllable } = useDemoLoop<HTMLOListElement>(DURATIONS, HOLD);
  const active = loopIndex;

  return (
    <div className="mt-14">
      <div className="flex items-center gap-4">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15" aria-hidden="true">
          <div
            className="h-full origin-left rounded-full bg-white transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: `scaleX(${Math.min(active, steps.length) / steps.length})` }}
          />
        </div>
        {controllable && <LoopToggle stopped={stopped} onToggle={toggle} label="the transfer steps" onDark />}
      </div>
      <ol ref={loopRef} className="mt-4 grid gap-3 sm:grid-cols-3" aria-label="How a transfer is made">
        {steps.map((step, i) => {
          const done = active > i;
          const current = active === i + 1 && active <= steps.length;
          return (
            <li
              key={step.title}
              className={`rounded-2xl px-5 py-4 transition-colors duration-500 ${current ? 'bg-white/[0.18]' : 'bg-white/[0.08]'}`}
            >
              <span className="flex items-center gap-4">
                <span
                  className={`num grid size-9 flex-none place-items-center rounded-full font-display font-bold transition-[background-color,color,scale] duration-300 ${
                    done ? 'bg-white text-brand-deep' : 'bg-white/20 text-white'
                  } ${current ? 'scale-110' : ''}`}
                >
                  {done && active > i + 1 ? <Icon name="check" size={16} /> : i + 1}
                </span>
                <span className="text-[17px] font-semibold">{step.title}</span>
              </span>
              <span className="mt-2 block pl-[52px] text-[15px] leading-6 text-[#d6dcff]">{step.text}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default TransferSteps;
