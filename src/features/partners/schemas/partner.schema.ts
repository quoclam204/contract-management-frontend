import { z } from 'zod';

export const VIETNAM_TAX_CODE_REGEX = /^([0-9]{10}(-[0-9]{3})?|[0-9]{13})$/;

export const partnerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Tên đối tác là bắt buộc')
    .min(2, 'Tên đối tác phải có ít nhất 2 ký tự')
    .max(255, 'Tên đối tác không được vượt quá 255 ký tự'),

  taxCode: z
    .string()
    .trim()
    .min(1, 'Mã số thuế là bắt buộc')
    .regex(
      VIETNAM_TAX_CODE_REGEX,
      'Mã số thuế không hợp lệ. Vui lòng nhập 10 chữ số hoặc 13 chữ số (VD: 0101234567 hoặc 0101234567-001)'
    ),

  representative: z
    .string()
    .trim()
    .min(1, 'Người đại diện là bắt buộc')
    .max(255, 'Người đại diện không được vượt quá 255 ký tự'),

  contactEmail: z
    .string()
    .trim()
    .min(1, 'Email liên hệ là bắt buộc')
    .email('Định dạng email liên hệ không hợp lệ')
    .max(255, 'Email liên hệ không được vượt quá 255 ký tự'),

  address: z
    .string()
    .trim()
    .min(1, 'Địa chỉ là bắt buộc')
    .max(500, 'Địa chỉ không được vượt quá 500 ký tự'),
});

export type PartnerFormData = z.infer<typeof partnerFormSchema>;
