from contextlib import asynccontextmanager
from fastapi import FastAPI
from services import read_cpu_stats, get_all_processes, calculate_cpu_percent, calculate_process_cpu, calculate_mem_percent, read_mem_stats
import uvicorn
import socket

stats = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    cpu_stats1 = read_cpu_stats()
    procs1 = get_all_processes()
    stats["init_cpu"] = cpu_stats1
    stats["init_procs"] = procs1
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/stats")
def get_stats():
    res = []
    
    cpu_stats1 = stats.get("init_cpu", [])
    procs1 = stats.get("init_procs")
    cpu_stats2 = read_cpu_stats()
    procs2 = get_all_processes()
    total_cpu_delta = sum(cpu_stats2) - sum(cpu_stats1)
    cpu_percent = calculate_cpu_percent(cpu_stats1, cpu_stats2)
    memory_percent = calculate_mem_percent(read_mem_stats())
    top_procs = calculate_process_cpu(procs1, procs2, total_cpu_delta)
    
    for proc in top_procs:
        pid = proc[0]
        name = proc[1]
        cpu = proc[2]
        res.append(
                {
                "pid": pid, 
                "name": name, 
                "cpu_percent": cpu
                }
            )
    
    stats["init_cpu"] = cpu_stats2
    stats["init_procs"] = procs2
    
    return {
        "hostname": socket.gethostname(),
        "cpu_percent": cpu_percent,
        "memory_percent": memory_percent,
        "top_processes": res
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)