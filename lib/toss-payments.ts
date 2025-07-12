import { supabase } from './supabase';

export type PaymentPlan = {
  id: string;
  name: string;
  price: number;
  credits: number;
};

export const paymentPlans: Record<string, PaymentPlan> = {
  basic: {
    id: 'basic',
    name: '기본 크레딧 팩',
    price: 10000,
    credits: 20,
  },
  pro: {
    id: 'pro',
    name: '프로 크레딧 팩',
    price: 25000,
    credits: 60,
  },
  business: {
    id: 'business',
    name: '비즈니스 크레딧 팩',
    price: 50000,
    credits: 150,
  },
};

export type PaymentData = {
  orderId: string;
  amount: number;
  orderName: string;
  customerName: string;
  customerEmail?: string;
  successUrl: string;
  failUrl: string;
};

/**
 * 결제 요청 데이터를 생성합니다.
 */
export function createPaymentData(
  planId: string,
  userId: string,
  userName: string,
  userEmail?: string
): PaymentData | null {
  const plan = paymentPlans[planId];
  if (!plan) return null;

  const orderId = `order_${planId}_${userId}_${Date.now()}`;
  
  return {
    orderId,
    amount: plan.price,
    orderName: `${plan.name} (${plan.credits}개 크레딧)`,
    customerName: userName,
    customerEmail: userEmail,
    successUrl: `${process.env.NEXT_PUBLIC_TOSS_SUCCESS_URL}?orderId=${orderId}`,
    failUrl: `${process.env.NEXT_PUBLIC_TOSS_FAIL_URL}?orderId=${orderId}`,
  };
} 