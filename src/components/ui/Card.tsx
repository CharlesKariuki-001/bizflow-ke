import React from 'react';
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}
export function Card({
  className = '',
  glass = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-2xl ${glass ? 'glass-card' : 'bg-surface border border-border shadow-soft-sm'} ${className}`}
      {...props}>
      
      {children}
    </div>);

}
export function CardHeader({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
      {children}
    </div>);

}
export function CardTitle({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-lg font-display font-semibold leading-none tracking-tight text-text ${className}`}
      {...props}>
      
      {children}
    </h3>);

}
export function CardContent({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>);

}