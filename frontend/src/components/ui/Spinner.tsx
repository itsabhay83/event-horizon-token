
interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const Spinner = ({ size = 'medium' }: SpinnerProps) => {
  const sizeClass = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClass[size]} border-4 border-zkpop-gray border-t-zkpop-indigo rounded-full animate-spin`}></div>
    </div>
  );
};

export default Spinner;
