import { CostCalculator } from "@/app/utils/costCalculator";

export default function Settings() {
  const variables = new CostCalculator(6, 1, 8);
  return (
    <div>
      <div>baseNannyHourlyPay: {variables.baseNannyHourlyPay}</div>
      <div>taxesAndInsuranceMargin: {variables.taxesAndInsuranceMargin}</div>
      <div>overheadMargin: {variables.overheadMargin}</div>
      <div>totalNannyHourlyPay: {variables.totalNannyHourlyPay}</div>
      <div>totalHours: {variables.totalHours}</div>
      <div>hourMultiplier: {variables.hourMultiplier}</div>
      <div>totalKids: {variables.totalKids}</div>
      <div>tierMultiplier: {variables.tierMultiplier}</div>
      <div>totalInfants: {variables.totalInfants}</div>
      <div>totalNannies: {variables.totalNannies}</div>
      <div>baseCost: {variables.baseCost}</div>
      <div>clientSubtotal: {variables.clientSubtotal}</div>
    </div>
  );
}
