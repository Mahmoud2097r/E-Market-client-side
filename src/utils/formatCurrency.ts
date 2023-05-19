const CURRENCY_FORMATTER = new Intl.NumberFormat('en-In', {
	currency: 'JOD',
	style: 'currency',
	minimumFractionDigits: 2,
	maximumFractionDigits: 3
});

export function formatCurrency(number: number) {
	const currency = CURRENCY_FORMATTER.format(number)
	return (currency);
}
