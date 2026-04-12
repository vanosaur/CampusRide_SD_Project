import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  useEffect(() => {
    const code = otp.join("");
    // Ensure we only fire when completely full
    if (code.length === length) {
      onComplete(code);
    }
  }, [otp, length, onComplete]);

  return (
    <div className="flex gap-2 justify-center my-6">
      {otp.map((data, index) => {
        return (
          <input
            className="w-12 h-12 text-center text-xl font-bold bg-gray-100 rounded-xl border border-transparent focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
            type="text"
            name="otp"
            maxLength={1}
            key={index}
            value={data}
            onChange={e => handleChange(e.target, index)}
            onFocus={e => e.target.select()}
            onKeyDown={e => onKeyDown(e, index)}
            ref={ref => { inputRefs.current[index] = ref; }}
          />
        );
      })}
    </div>
  );
};

export default OTPInput;
