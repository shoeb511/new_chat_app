import os from 'os';
import mongoose from 'mongoose';

const MAX_MEMORY_MB = 512;
const MAX_CPU_LOAD = 1.5;

export const getHealth = async (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;

        if(dbState != 1) {
            return res.status(500).json({
                STATUS: 'DOWN',
                REASON: 'DB disconnected'
            });
        }

        const usedMb = process.memoryUsage().rss /1024 /1024;

        if(usedMb > MAX_MEMORY_MB){
            return res.status(503).json({
                Status: 'DEGRAGED',
                Reason: 'HIGH MEMORY',
                usedmemory: Math.round(usedMb)
            });
        }

        const load = os.loadavg()[0] / os.cpus().length;

        if(load > MAX_CPU_LOAD){
            return res.status(503).json({
                Status: 'DEGRADED',
                Reason: 'HEAVY CPU LOAD',
                CPU_LOAD: load.toFixed(2)
            });
        }

        const start = process.hrtime();

        setImmediate(() => {
            const diff = process.hrtime(start);
            const delayMs = diff[0] * 1000 + diff[1] / 1e6;

            if(delayMs > 200){
                return res.status(503).json({
                    Status: 'DEGRADED',
                    Reason: 'EVENT LOOP LAG',
                    delayMs: Math.round(delayMs)
                });
            }

            return res.status(200).json({
                STATUS: 'OK',
                MEMORY_MB: Math.round(usedMb),
                CPU_LOAD: load.toFixed(2)
            });
        });


    }
    catch (err) {
        return res.status(500).json({
            Status: 'DOWN',
            error: err.message
        });
    }
}