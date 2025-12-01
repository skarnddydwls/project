// BulletHellGame.js
import React, { useEffect, useRef, useState } from "react";
import "../css/BulletHellGame.css"; // 이미 있으면 그대로, 없으면 나중에 만들어도 됨

// ----- 상수들 -----
const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 640;

const MAX_LIVES = 3;            // 플레이어 목숨
const INVINCIBLE_TIME = 1500;   // 피격 후 무적 시간(ms)

const BASE_SCORE = 10;          // 적 기본 점수
const COMBO_BONUS = 2;          // 콤보 1당 추가 점수
const COMBO_RESET_TIME = 2500;  // 콤보 유지 시간(ms)

const ITEM_DROP_CHANCE = 0.2;   // 적 처치 시 아이템 드롭 확률(20%)

const BOSS_SPAWN_TIME = 20000;  // 보스 등장 시간 (ms)
const BOSS_MAX_HP = 80;         // 보스 체력

// 난이도 설정 (Lunatic 포함)
const DIFFICULTY_CONFIG = {
  easy: {
    enemySpawnInterval: 1000,
    enemySpeedMin: 0.8,
    enemySpeedMax: 1.2,
    playerSpeed: 6,
    maxEnemies: 10,
  },
  normal: {
    enemySpawnInterval: 700,
    enemySpeedMin: 1.2,
    enemySpeedMax: 1.8,
    playerSpeed: 5,
    maxEnemies: 15,
  },
  hard: {
    enemySpawnInterval: 450,
    enemySpeedMin: 1.8,
    enemySpeedMax: 2.6,
    playerSpeed: 4,
    maxEnemies: 25,
  },
  lunatic: {
    enemySpawnInterval: 300,
    enemySpeedMin: 2.1,
    enemySpeedMax: 3.0,
    playerSpeed: 4,
    maxEnemies: 35,
  },
};

export default function BulletHellGame() {
  const canvasRef = useRef(null);

  // ----- React 상태 (UI 표시용) -----
  const [difficulty, setDifficulty] = useState("normal");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [gameOver, setGameOver] = useState(false);

  // ----- 내부 로직용 ref (게임 루프용) -----
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);
  const comboRef = useRef(0);
  const comboTimerRef = useRef(0);
  const livesRef = useRef(MAX_LIVES);
  const invincibleTimerRef = useRef(0);
  const timeElapsedRef = useRef(0); // 전체 경과 시간(ms)

  // 처음 렌더링 시 localStorage에서 하이스코어 불러오기
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bulletHellHighScore");
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed)) {
          highScoreRef.current = parsed;
          setHighScore(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load high score:", e);
    }
  }, []);

  // 난이도 바뀔 때마다 게임 전체 리셋
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const config = DIFFICULTY_CONFIG[difficulty];

    // ----- 상태 초기화 -----
    scoreRef.current = 0;
    setScore(0);
    comboRef.current = 0;
    comboTimerRef.current = 0;
    setCombo(0);
    livesRef.current = MAX_LIVES;
    setLives(MAX_LIVES);
    invincibleTimerRef.current = 0;
    timeElapsedRef.current = 0;
    setGameOver(false);

    // 플레이어 (easy에서만 히트박스 축소)
    const player = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 60,
      radius: difficulty === "easy" ? 6 : 10,
      speed: config.playerSpeed,
    };

    // 오브젝트 컨테이너들
    let bullets = [];      // 플레이어 탄
    let enemies = [];      // 일반 적
    let items = [];        // 아이템
    let boss = null;       // 보스
    let bossBullets = [];  // 보스 탄
    let explosions = [];   // 폭발 이펙트

    // 입력 상태
    let keys = {};

    // 타이밍
    let lastTime = 0;
    let enemySpawnTimer = 0;
    let shootCooldown = 0;
    let isRunning = true;

    // ----- 입력 처리 -----
    const handleKeyDown = (e) => {
      keys[e.code] = true;
    };
    const handleKeyUp = (e) => {
      keys[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // ----- 유틸 함수들 -----

    // 일반 적 생성
    function spawnEnemy() {
      if (enemies.length >= config.maxEnemies) return;

      const baseX = Math.random() * (CANVAS_WIDTH - 40) + 20;
      const vy =
        config.enemySpeedMin +
        Math.random() * (config.enemySpeedMax - config.enemySpeedMin);

      enemies.push({
        baseX,         // 웨이브 기준 X
        x: baseX,
        y: -20,
        radius: 12,
        vy,
        seed: Math.random() * 10, // 웨이브 위상
      });
    }

    // 웨이브 이동 (S자/지그재그 느낌)
    function updateEnemyWave(enemy, time) {
      const wave = Math.sin(time / 300 + enemy.seed) * 40; // 좌우 40px 진동
      enemy.x = enemy.baseX + wave;
    }

    // 플레이어 탄 발사
    function shoot() {
      bullets.push({
        x: player.x,
        y: player.y - 15,
        vy: -6,
      });
    }

    // 원형 충돌 체크
    function checkCollision(a, b, r) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return dx * dx + dy * dy < r * r;
    }

    // 점수 + 콤보 처리
    function addScoreWithCombo() {
      // 콤보 증가
      comboRef.current += 1;
      setCombo(comboRef.current);

      // 콤보 유지 시간 리셋
      comboTimerRef.current = COMBO_RESET_TIME;

      // 점수 = 기본 점수 + 콤보 보너스
      const gain =
        BASE_SCORE + COMBO_BONUS * Math.max(0, comboRef.current - 1);

      const newScore = scoreRef.current + gain;
      scoreRef.current = newScore;
      setScore(newScore);

      // 하이스코어 갱신
      if (newScore > highScoreRef.current) {
        highScoreRef.current = newScore;
        setHighScore(newScore);
        try {
          localStorage.setItem("bulletHellHighScore", String(newScore));
        } catch (e) {
          console.error("Failed to save high score:", e);
        }
      }
    }

    // 아이템 드롭
    function maybeDropItem(x, y) {
      if (Math.random() < ITEM_DROP_CHANCE) {
        items.push({
          x,
          y,
          vy: 1.2,
          radius: 8,
          type: "life", // 일단 목숨/보너스용
        });
      }
    }

    // 폭발 이펙트 생성
    function spawnExplosion(x, y) {
      explosions.push({
        x,
        y,
        life: 0,
        maxLife: 300, // 0.3초
      });
    }

    // 보스 생성
    function spawnBoss() {
      boss = {
        x: CANVAS_WIDTH / 2,
        y: 120,
        radius: 26,
        hp: BOSS_MAX_HP,
        maxHp: BOSS_MAX_HP,
        dir: 1,
        shootTimer: 0,
        pattern: 0, // 패턴 ID
      };
    }

    // 패턴 0: 동방풍 스파이럴 + 동심원 탄막
    function spiralPattern() {
      if (!boss) return;

      let baseCount;
      let speed;

      if (difficulty === "easy") {
        baseCount = 10;
        speed = 1.6;
      } else if (difficulty === "normal") {
        baseCount = 20;
        speed = 2.2;
      } else if (difficulty === "hard") {
        baseCount = 32;
        speed = 2.9;
      } else {
        // lunatic
        baseCount = 48;
        speed = 3.6;
      }

      // 시간에 따라 계속 회전하는 각도 (스파이럴)
      const spiral = (timeElapsedRef.current / 250) % (Math.PI * 2);

      // 2중 원형 탄막
      for (let r = 0; r < 2; r++) {
        const count = baseCount + r * 4;
        const layerSpeed = speed + r * 0.6;

        for (let i = 0; i < count; i++) {
          const angle = spiral + (Math.PI * 2 * i) / count;

          bossBullets.push({
            x: boss.x,
            y: boss.y,
            vx: Math.cos(angle) * layerSpeed,
            vy: Math.sin(angle) * layerSpeed,
            radius: 4 - r,
          });
        }
      }
    }

    // 패턴 1: Burst 패턴 (아래로 한 번에 쏟아짐)
    function burstPattern() {
      if (!boss) return;

      const count = difficulty === "lunatic" ? 11 : 7;
      const spread = difficulty === "lunatic" ? 1.4 : 1.0;

      for (let i = -Math.floor(count / 2); i <= Math.floor(count / 2); i++) {
        bossBullets.push({
          x: boss.x,
          y: boss.y,
          vx: i * spread,
          vy: 3,
          radius: 4,
        });
      }
    }

    // 패턴 2: 플레이어 조준 탄막
    function aimedPattern() {
      if (!boss) return;

      const dx = player.x - boss.x;
      const dy = player.y - boss.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const speed = difficulty === "lunatic" ? 3.6 : 3.1;

      bossBullets.push({
        x: boss.x,
        y: boss.y,
        vx: (dx / len) * speed,
        vy: (dy / len) * speed,
        radius: 4,
      });
    }

    // 보스 탄막 패턴 라우팅
    function bossShootPattern() {
      if (!boss) return;

      switch (boss.pattern) {
        case 0:
          spiralPattern();
          break;
        case 1:
          burstPattern();
          break;
        case 2:
          aimedPattern();
          break;
        default:
          spiralPattern();
      }
    }

    // ----- 메인 게임 루프 -----
    function gameLoop(timestamp) {
      if (!isRunning) return;

      const delta = timestamp - lastTime;
      lastTime = timestamp;

      timeElapsedRef.current += delta;
      enemySpawnTimer += delta;
      shootCooldown -= delta;

      // 콤보 유지 시간 감소
      if (comboRef.current > 0) {
        comboTimerRef.current -= delta;
        if (comboTimerRef.current <= 0) {
          comboRef.current = 0;
          comboTimerRef.current = 0;
          setCombo(0);
        }
      }

      // 무적 시간 감소
      if (invincibleTimerRef.current > 0) {
        invincibleTimerRef.current -= delta;
      }
      const isInvincible = invincibleTimerRef.current > 0;

      // 보스 없고 일정 시간 지나면 보스 등장
      if (!boss && timeElapsedRef.current > BOSS_SPAWN_TIME) {
        spawnBoss();
      }

      // 보스가 없을 때만 일반 적 계속 스폰
      if (!boss && enemySpawnTimer > DIFFICULTY_CONFIG[difficulty].enemySpawnInterval) {
        spawnEnemy();
        enemySpawnTimer = 0;
      }

      // 플레이어 이동
      if (keys["ArrowLeft"]) player.x -= player.speed;
      if (keys["ArrowRight"]) player.x += player.speed;
      if (keys["ArrowUp"]) player.y -= player.speed;
      if (keys["ArrowDown"]) player.y += player.speed;

      // 화면 밖 제한
      player.x = Math.max(15, Math.min(CANVAS_WIDTH - 15, player.x));
      player.y = Math.max(15, Math.min(CANVAS_HEIGHT - 15, player.y));

      // 발사(쿨타임 120ms)
      if (keys["Space"] && shootCooldown <= 0) {
        shoot();
        shootCooldown = 120;
      }

      // 플레이어 탄 이동
      bullets.forEach((b) => {
        b.y += b.vy;
      });
      bullets = bullets.filter((b) => b.y > -20);

      // 일반 적 이동 + 웨이브
      enemies.forEach((e) => {
        updateEnemyWave(e, timeElapsedRef.current);
        e.y += e.vy;
      });
      enemies = enemies.filter((e) => e.y < CANVAS_HEIGHT + 40);

      // 아이템 이동
      items.forEach((item) => {
        item.y += item.vy;
      });
      items = items.filter((item) => item.y < CANVAS_HEIGHT + 40);

      // 보스 이동 + 패턴 로테이션 + 탄막 발사
      if (boss) {
        // 좌우 이동
        boss.x += boss.dir * 1.2;
        if (boss.x < 60 || boss.x > CANVAS_WIDTH - 60) {
          boss.dir *= -1;
        }

        // 패턴 변경 (5초마다 순환)
        boss.pattern = Math.floor((timeElapsedRef.current / 5000) % 3);

        // 탄막 발사 타이머
        boss.shootTimer += delta;
        const shootInterval =
          difficulty === "lunatic" ? 550 : 800; // 루나틱은 더 자주 쏨
        if (boss.shootTimer > shootInterval) {
          bossShootPattern();
          boss.shootTimer = 0;
        }
      }

      // 보스 탄 이동
      bossBullets.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;
      });
      bossBullets = bossBullets.filter(
        (b) =>
          b.x > -30 &&
          b.x < CANVAS_WIDTH + 30 &&
          b.y > -30 &&
          b.y < CANVAS_HEIGHT + 30
      );

      // 폭발 이펙트 업데이트
      explosions.forEach((ex) => {
        ex.life += delta;
      });
      explosions = explosions.filter((ex) => ex.life < ex.maxLife);

      // ----- 충돌 처리: 플레이어 탄 ↔ 일반 적 -----
      enemies = enemies.filter((enemy) => {
        let hit = false;
        bullets = bullets.filter((bullet) => {
          if (checkCollision(enemy, bullet, enemy.radius + 4)) {
            hit = true;
            addScoreWithCombo();
            spawnExplosion(enemy.x, enemy.y);
            maybeDropItem(enemy.x, enemy.y);
            return false;
          }
          return true;
        });
        return !hit;
      });

      // ----- 충돌 처리: 플레이어 탄 ↔ 보스 -----
      if (boss) {
        bullets = bullets.filter((bullet) => {
          if (checkCollision(boss, bullet, boss.radius + 4)) {
            boss.hp -= 2;
            spawnExplosion(bullet.x, bullet.y);
            addScoreWithCombo();
            return false;
          }
          return true;
        });

        // 보스 사망 시
        if (boss.hp <= 0) {
          spawnExplosion(boss.x, boss.y);
          scoreRef.current += 200;
          setScore(scoreRef.current);
          if (scoreRef.current > highScoreRef.current) {
            highScoreRef.current = scoreRef.current;
            setHighScore(scoreRef.current);
            try {
              localStorage.setItem(
                "bulletHellHighScore",
                String(scoreRef.current)
              );
            } catch (e) {
              console.error("Failed to save high score:", e);
            }
          }
          boss = null;
        }
      }

      // ----- 충돌 처리: 플레이어 ↔ 아이템 -----
      items = items.filter((item) => {
        if (checkCollision(player, item, player.radius + item.radius)) {
          if (item.type === "life") {
            if (livesRef.current < MAX_LIVES) {
              livesRef.current += 1;
              setLives(livesRef.current);
            } else {
              // 풀 체력이면 점수 보너스
              scoreRef.current += 30;
              setScore(scoreRef.current);
              if (scoreRef.current > highScoreRef.current) {
                highScoreRef.current = scoreRef.current;
                setHighScore(scoreRef.current);
                try {
                  localStorage.setItem(
                    "bulletHellHighScore",
                    String(scoreRef.current)
                  );
                } catch (e) {
                  console.error("Failed to save high score:", e);
                }
              }
            }
          }
          return false;
        }
        return true;
      });

      // ----- 충돌 처리: 플레이어 ↔ 일반 적 -----
      if (!isInvincible) {
        for (const enemy of enemies) {
          if (checkCollision(enemy, player, enemy.radius + player.radius)) {
            livesRef.current -= 1;
            setLives(livesRef.current);
            spawnExplosion(player.x, player.y);
            invincibleTimerRef.current = INVINCIBLE_TIME;
            if (livesRef.current <= 0) {
              isRunning = false;
              setGameOver(true);
            }
            break;
          }
        }
      }

      // ----- 충돌 처리: 플레이어 ↔ 보스 탄 -----
      if (!isInvincible) {
        for (const b of bossBullets) {
          if (checkCollision(b, player, player.radius + b.radius)) {
            livesRef.current -= 1;
            setLives(livesRef.current);
            spawnExplosion(player.x, player.y);
            invincibleTimerRef.current = INVINCIBLE_TIME;
            if (livesRef.current <= 0) {
              isRunning = false;
              setGameOver(true);
            }
            break;
          }
        }
      }

      // 게임 오버면 마지막 프레임만 그리고 종료
      if (!isRunning) {
        drawFrame();
        return;
      }

      // 프레임 그리기
      drawFrame();
      requestAnimationFrame(gameLoop);
    }

    // ----- 그리기 함수 -----
    function drawFrame() {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 플레이어 (무적 시 반투명)
      ctx.save();
      if (invincibleTimerRef.current > 0) {
        ctx.globalAlpha = 0.5;
      }
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 플레이어 탄
      ctx.fillStyle = "#fbbf24";
      bullets.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // 일반 적
      ctx.fillStyle = "#f97373";
      enemies.forEach((e) => {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 아이템 (초록색)
      ctx.fillStyle = "#4ade80";
      items.forEach((item) => {
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 보스 + HP바
      if (boss) {
        ctx.fillStyle = "#a855f7";
        ctx.beginPath();
        ctx.arc(boss.x, boss.y, boss.radius, 0, Math.PI * 2);
        ctx.fill();

        const barWidth = 200;
        const barHeight = 10;
        const hpRatio = Math.max(0, boss.hp / boss.maxHp);
        ctx.fillStyle = "#1f2933";
        ctx.fillRect(
          CANVAS_WIDTH / 2 - barWidth / 2,
          30,
          barWidth,
          barHeight
        );
        ctx.fillStyle = "#22c55e";
        ctx.fillRect(
          CANVAS_WIDTH / 2 - barWidth / 2,
          30,
          barWidth * hpRatio,
          barHeight
        );
      }

      // 보스 탄
      ctx.fillStyle = "#e5e7eb";
      bossBullets.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 폭발 이펙트
      explosions.forEach((ex) => {
        const t = ex.life / ex.maxLife; // 0~1
        const radius = 8 + t * 18;
        const alpha = 1 - t;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#f97316";
        ctx.beginPath();
        ctx.arc(ex.x, ex.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    // 첫 게임 루프 시작
    requestAnimationFrame(gameLoop);

    // cleanup
    return () => {
      isRunning = false;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [difficulty]);

  // ----- JSX (UI) -----
  return (
    <div className="game-container">
      <h2 className="game-title">탄막 슈팅 게임 (React + Canvas)</h2>

      <div className="difficulty-row">
        <span className="label">난이도:</span>
        {["easy", "normal", "hard", "lunatic"].map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={
              difficulty === d ? "btn difficulty-btn selected" : "btn difficulty-btn"
            }
          >
            {d.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="status-bar">
        <div className="status-item">점수: {score}</div>
        <div className="status-item">최고 점수: {highScore}</div>
        <div className="status-item">
          콤보: {combo > 0 ? `${combo}x` : "-"}
        </div>
        <div className="status-item">
          목숨: {lives > 0 ? "❤️".repeat(lives) : "없음"}
        </div>
      </div>

      {gameOver && (
        <div className="game-over-banner">
          GAME OVER
          <br />
          난이도: {difficulty.toUpperCase()} / 점수: {score}
          <br />
          난이도를 다시 선택하면 재시작됩니다.
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="game-canvas"
      />
    </div>
  );
}
