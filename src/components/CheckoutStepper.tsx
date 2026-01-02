
import Link from 'next/link';

interface CheckoutStepperProps {
    currentStep: 'shop' | 'cart' | 'checkout';
}

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
    const steps = [
        { id: 'shop', label: 'Shop', href: '/products', number: 1 },
        { id: 'cart', label: 'Cart', href: '/cart', number: 2 },
        { id: 'checkout', label: 'Checkout', href: '/checkout', number: 3 },
    ];

    return (
        <div className="flex items-center space-x-2 md:space-x-4 text-sm font-medium">
            {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
                const isLast = index === steps.length - 1;

                return (
                    <div key={step.id} className="flex items-center">
                        <Link
                            href={step.href}
                            className={`flex items-center transition ${isActive ? 'text-blue-600 font-bold' :
                                    isCompleted ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-500'
                                }`}
                        >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs border ${isActive ? 'bg-blue-600 text-white border-blue-600' :
                                    isCompleted ? 'bg-green-100 text-green-600 border-green-200' : 'border-gray-200 text-gray-400'
                                }`}>
                                {isCompleted ? '✓' : step.number}
                            </span>
                            {step.label}
                        </Link>
                        {!isLast && (
                            <div className={`w-8 h-px mx-4 ${isCompleted ? 'bg-green-200' : 'bg-gray-200'}`}></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
