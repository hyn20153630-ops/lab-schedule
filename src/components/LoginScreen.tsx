import { isSupabaseConfigured } from '../lib/supabaseClient'

interface Props {
  onGoogleLogin: () => void
  onGuest: () => void
}

export function LoginScreen({ onGoogleLogin, onGuest }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white rounded-3xl border border-stone-200 shadow-sm p-8 text-center space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">
            실험실 주간 일정
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            프로젝트별 요일 일정을 한눈에 관리하세요.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onGoogleLogin}
            disabled={!isSupabaseConfigured}
            className="w-full py-2.5 rounded-full bg-stone-800 text-white text-sm font-medium hover:bg-stone-700 transition-colors disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed"
          >
            Google로 로그인
          </button>
          {!isSupabaseConfigured && (
            <p className="text-xs text-amber-600">
              Supabase 연동이 아직 설정되지 않았습니다.
            </p>
          )}

          <button
            type="button"
            onClick={onGuest}
            className="w-full py-2.5 rounded-full border border-stone-300 text-stone-600 text-sm font-medium hover:bg-stone-50 transition-colors"
          >
            게스트로 시작
          </button>
        </div>

        <p className="text-xs text-stone-400 leading-relaxed">
          게스트 모드는 데이터가 저장되지 않아요.
          <br />
          로그인하면 데이터가 저장됩니다.
        </p>
      </div>
    </div>
  )
}
