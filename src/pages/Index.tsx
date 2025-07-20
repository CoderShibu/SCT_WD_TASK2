import Calculator from '@/components/Calculator';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-foreground">Calculator</h1>
          <p className="text-muted-foreground">A modern calculator with keyboard support</p>
        </div>
        <Calculator />
        <p className="text-sm text-muted-foreground max-w-md">
          Use your keyboard for quick calculations: numbers, +, -, *, /, Enter (=), and Escape (Clear)
        </p>
      </div>
    </div>
  );
};

export default Index;
